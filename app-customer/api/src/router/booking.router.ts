import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type {
  BookingItem,
  Center,
  CustomerAddresses,
  Pet,
  Service,
  Slot,
} from "@petzo/db";
import { SLOT_DURATION_IN_MINS } from "@petzo/constants";
import { and, desc, eq, inArray, schema, sql } from "@petzo/db";
import { getGoogleLocationLink, slackUtils } from "@petzo/utils";
import { convertTime24To12, getSurroundingTime } from "@petzo/utils/time";
import { bookingValidator } from "@petzo/validators";

import type { CTX } from "../trpc";
import { getFullFormattedAddresses } from "../../../../packages/utils/src/addresses.utils";
import { protectedProcedure } from "../trpc";

const MAX_RETRIES = 3;

export const bookingRouter = {
  bookService: protectedProcedure
    .input(bookingValidator.BookService)
    .mutation(async ({ ctx, input }) => {
      const bookingCenter = (
        await ctx.db
          .select()
          .from(schema.centers)
          .where(eq(schema.centers.id, input.centerId))
      )?.[0];

      if (!bookingCenter) {
        throw bookingRouterUtils.badRequestError("Booking center not found.");
      }

      // TODO: Address is required for home service. For other services, it is optional.
      const bookingAddress = await bookingRouterUtils.getBookingAddress(
        ctx,
        input.addressId,
      );

      if (!bookingAddress) {
        throw bookingRouterUtils.badRequestError("Booking address not found.");
      }

      const bookingItems = await bookingRouterUtils.getBookingItems(
        ctx,
        input.centerId,
        input.items,
      );

      // Check if all the items are valid.
      input?.items?.forEach((_, index) => {
        if (!bookingItems[index]) {
          throw bookingRouterUtils.badRequestError(
            "Some of the booking items are invalid",
          );
        }
      });

      const servicesByType = await bookingRouterUtils.getServicesByType(
        ctx,
        input.centerId,
      );

      let retries = 0;
      let bookingId;

      while (retries < MAX_RETRIES) {
        try {
          bookingId = await ctx.db.transaction(
            async (tx) => {
              const totalBookingAmount = bookingItems.reduce(
                (acc, item) => acc + (item?.service.discountedPrice ?? 0),
                0,
              );

              const booking = (
                await tx
                  .insert(schema.bookings)
                  .values({
                    customerUserId: ctx.session.user.id,
                    addressId: input.addressId,
                    centerId: input.centerId,
                    amount: totalBookingAmount,
                    isPaid: false,
                  })
                  .returning()
              )[0];

              const bookingItemsInsertData = [];

              // For each booking item, we will lock the slots for all the services of same type..
              for (const item of bookingItems) {
                // Get the surrounding times for the slot.
                const surroundingTimes = getSurroundingTime(
                  item!.slot.startTime,
                  item!.service.duration - SLOT_DURATION_IN_MINS,
                );

                const serviceIdsToBlock = servicesByType[
                  item!.service.serviceType
                ]!.map((service) => service.id);

                // For Update will lock the rows for update.
                // So any other transaction trying to update the same rows will wait.
                const affectedSlots = await tx
                  .select()
                  .from(schema.slots)
                  .where(
                    and(
                      inArray(schema.slots.serviceId, serviceIdsToBlock),
                      inArray(schema.slots.startTime, surroundingTimes),
                      eq(schema.slots.date, item!.slot.date),
                    ),
                  )
                  .for("update");

                // Check if the slot that is being booked is available. As we have locked the rows,
                // we don't need to worry about updates with other transactions.
                affectedSlots?.forEach((slot) => {
                  if (slot.id == item!.slot.id && slot.availableSlots <= 0) {
                    throw bookingRouterUtils.badRequestError(
                      "Some of the booked slots are not available.",
                    );
                  }
                });

                const affectedSlotsIds = affectedSlots.map((slot) => slot.id);

                // For all the affected slots, we will decrease the availableSlots count.
                await tx
                  .update(schema.slots)
                  .set({
                    availableSlots: sql`${schema.slots.availableSlots} - 1`,
                  })
                  .where(and(inArray(schema.slots.id, affectedSlotsIds)));

                bookingItemsInsertData.push({
                  bookingId: booking!.id,
                  serviceId: item!.service.id,
                  slotId: item!.slot.id,
                  petId: item!.pet.id,
                  amount: item!.service.discountedPrice,
                });
              }

              // If all the slots are updated, then insert the booking items.
              await tx
                .insert(schema.bookingItems)
                .values(bookingItemsInsertData)
                .returning();

              return booking?.id;
            },
            {
              isolationLevel: "serializable",
            },
          );

          // If the transaction is successful, then break the loop. Otherwise, it will keep retrying.
          break;
        } catch (error: unknown) {
          if ((error as { code?: string })?.code === "40001") {
            // PostgreSQL serialization failure
            retries++;
            continue;
          }

          throw error;
        }
      }

      await bookingRouterUtils.sendBookingSlackMessage(
        ctx,
        bookingCenter,
        bookingAddress,
        bookingItems as BookingItem[],
        bookingId,
      );

      return bookingId;
    }),

  getBookings: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.bookings.findMany({
      where: eq(schema.bookings.customerUserId, ctx.session.user.id),
      orderBy: desc(schema.bookings.createdAt),
      with: {
        center: {
          columns: { name: true, id: true, publicId: true, images: true },
        },
        address: true,
        items: {
          with: {
            service: {
              columns: { name: true, id: true, publicId: true, price: true },
            },
            slot: { columns: { id: true, date: true, startTime: true } },
            pet: { columns: { name: true, id: true } },
          },
        },
      },
    });
  }),

  getBooking: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.bookings.findFirst({
        where: and(
          eq(schema.bookings.customerUserId, ctx.session.user.id),
          eq(schema.bookings.id, input.id),
        ),
        orderBy: desc(schema.bookings.createdAt),
        with: {
          center: {
            columns: { name: true, id: true, publicId: true, images: true },
          },
          address: true,
          items: {
            with: {
              service: {
                columns: { name: true, id: true, publicId: true, price: true },
              },
              slot: { columns: { id: true, date: true, startTime: true } },
              pet: { columns: { name: true, id: true } },
            },
          },
        },
      });
    }),
};

export const bookingRouterUtils = {
  async sendBookingSlackMessage(
    ctx: CTX,
    bookingCenter: Center,
    bookingAddress: CustomerAddresses,
    bookingItems?: BookingItem[],
    bookingId?: number,
  ) {
    if (!bookingId) return;

    let message = `Booking Id: ${bookingId}, Center: ${bookingCenter.name}, Email: ${ctx.session!.user.email},\n--------------\n`;
    message += `Name: ${ctx.session!.user.name}, Phone Number: \`${bookingAddress.phoneNumber}\`\n--------------\n`;

    message += "Service Booked:\n";
    bookingItems?.forEach((item, idx) => {
      if (!item) return;
      message += `${idx + 1}) Service: \`${item.service!.name}\`,\n    Price: \`₹${item.service!.price}\`\n    Slot: \`${item.slot!.date} ${convertTime24To12(item.slot!.startTime)}\`,\n    Pet Name: \`${item.pet!.name}\`\n    Pet Type: \`${item.pet!.type}\`\n`;
    });

    message += `--------------\nAddress: ${getFullFormattedAddresses(bookingAddress)}\n`;
    message += `Map Link: ${getGoogleLocationLink(bookingAddress.geocode)}\n`;

    await slackUtils.sendSlackMessage({
      channel: "#booking-alerts",
      username: "booking-bot",
      iconEmoji: ":tada:",
      message: message,
    });
  },

  async getBookingAddress(ctx: CTX, addressId?: number) {
    if (!addressId) {
      return null;
    }

    return (
      await ctx.db.query.customerAddresses.findMany({
        where: eq(schema.customerAddresses.id, addressId),
        with: {
          area: true,
          city: true,
          state: true,
        },
      })
    )[0];
  },
  async getServicesByType(ctx: CTX, centerId: number) {
    return (
      await ctx.db.query.services.findMany({
        where: eq(schema.services.centerId, centerId),
        columns: {
          id: true,
          serviceType: true,
        },
      })
    ).reduce(
      (acc, service) => {
        if (!acc[service.serviceType]) {
          acc[service.serviceType] = [];
        }

        acc[service.serviceType]!.push(service);

        return acc;
      },
      {} as Record<
        string,
        {
          id: number;
          serviceType: string;
        }[]
      >,
    );
  },
  async getBookingItems(
    ctx: CTX,
    centerId: number,
    bookingItems: {
      petId: number;
      serviceId: number;
      slotId: number;
    }[],
  ) {
    const bookingItemsPromises: Promise<
      {
        service: Service;
        slot: Slot;
        pet: Pet;
      }[]
    >[] = [];

    bookingItems?.forEach((item) => {
      // This will return only one item in the array
      const bookingItems = ctx.db
        .select()
        .from(schema.services)
        .where(
          and(
            eq(schema.services.centerId, centerId),
            eq(schema.services.id, item.serviceId),
          ),
        )
        .innerJoin(
          schema.slots,
          and(
            eq(schema.slots.serviceId, item.serviceId),
            eq(schema.slots.id, item.slotId),
          ),
        )
        .innerJoin(
          schema.pets,
          and(
            eq(schema.pets.id, item.petId),
            eq(schema.pets.customerUserId, ctx.session!.user.id),
          ),
        );

      bookingItemsPromises.push(bookingItems);
    });

    return (await Promise.all(bookingItemsPromises)).map((item) => item[0]);
  },

  badRequestError(message: string) {
    new TRPCError({
      message: message,
      code: "BAD_REQUEST",
    });
  },
};

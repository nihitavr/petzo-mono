import { TRPCError } from "@trpc/server";

import type { Pet, Service, Slot } from "@petzo/db";
import { SLOT_DURATION_IN_MINS } from "@petzo/constants";
import { and, eq, gte, inArray, schema, sql } from "@petzo/db";
import { getSurroundingTime } from "@petzo/utils/time";
import { bookingValidator } from "@petzo/validators";

import { protectedProcedure } from "../trpc";

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
        throw new TRPCError({
          message: "Booking center not found.",
          code: "BAD_REQUEST",
        });
      }

      // TODO: Address is required for home service. For other services, it is optional.
      // But for now we are assuming that address is always required as we are not supporting other services.
      const bookingAddress = (
        await ctx.db
          .select()
          .from(schema.customerAddresses)
          .where(eq(schema.customerAddresses.id, input.addressId))
      )?.[0];

      if (!bookingAddress) {
        throw new TRPCError({
          message: "Booking address not found.",
          code: "BAD_REQUEST",
        });
      }

      const bookingItemsPromises: Promise<
        {
          service: Service;
          slot: Slot;
          pet: Pet;
        }[]
      >[] = [];

      input?.items?.forEach((item) => {
        // This will return only one item in the array
        const bookingItems = ctx.db
          .select()
          .from(schema.services)
          .where(
            and(
              eq(schema.services.centerId, input.centerId),
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
              eq(schema.pets.customerUserId, ctx.session.user.id),
            ),
          );

        bookingItemsPromises.push(bookingItems);
      });

      const bookingItems = (await Promise.all(bookingItemsPromises)).map(
        (item) => item[0],
      );

      // Check if all the items are valid.
      input?.items?.forEach((_, index) => {
        if (!bookingItems[index]) {
          throw new TRPCError({
            message: "Some of the booking data is invalid",
            code: "BAD_REQUEST",
          });
        }
      });

      const servicesByType = (
        await ctx.db.query.services.findMany({
          where: eq(schema.services.centerId, input.centerId),
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

      await ctx.db.transaction(
        async (tx) => {
          const totalBookingAmount = bookingItems.reduce(
            (acc, item) => acc + (item?.service.price ?? 0),
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
          for (const item of bookingItems) {
            if (item!.slot.availableSlots <= 0) {
              try {
                tx.rollback();
              } catch (error) {
                throw new TRPCError({
                  message: "Some of the booked slots are not available.",
                  code: "BAD_REQUEST",
                });
              }
            }

            const surroundingTimes = getSurroundingTime(
              item!.slot.startTime,
              item!.service.duration - SLOT_DURATION_IN_MINS,
            );

            const serviceIds = servicesByType[item!.service.serviceType]!.map(
              (service) => service.id,
            );

            const serviceTypeAllSlotsForSurroundingTimes = await tx
              .select()
              .from(schema.slots)
              .where(
                and(
                  inArray(schema.slots.serviceId, serviceIds),
                  inArray(schema.slots.startTime, surroundingTimes),
                  eq(schema.slots.date, item!.slot.date),
                ),
              )
              .for("update");

            const updateSlotIds = serviceTypeAllSlotsForSurroundingTimes.map(
              (slot) => slot.id,
            );

            await tx
              .update(schema.slots)
              .set({
                availableSlots: sql`${schema.slots.availableSlots} - 1`,
              })
              .where(
                and(
                  inArray(schema.slots.id, updateSlotIds),
                  gte(schema.slots.availableSlots, 1),
                ),
              );

            bookingItemsInsertData.push({
              bookingId: booking!.id,
              serviceId: item!.service.id,
              slotId: item!.slot.id,
              petId: item!.pet.id,
              amount: item!.service.price,
            });
          }

          await tx
            .insert(schema.bookingItems)
            .values(bookingItemsInsertData)
            .returning();
        },
        {
          isolationLevel: "read uncommitted",
        },
      );
    }),
};

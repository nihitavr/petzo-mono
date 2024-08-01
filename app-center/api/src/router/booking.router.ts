import { SLOT_DURATION_IN_MINS } from "@petzo/constants";
import {
  and,
  asc,
  between,
  countDistinct,
  eq,
  inArray,
  schema,
  sql,
} from "@petzo/db";
import { getDateString, getSurroundingTime } from "@petzo/utils/time";
import { centerApp } from "@petzo/validators";

import { protectedCenterProcedure } from "../trpc";

export const bookingRouter = {
  getDashboardBookingStats: protectedCenterProcedure.query(async ({ ctx }) => {
    const getBookingCount = async (
      statuses: string[],
      date?: { startDate: string; endDate: string },
    ) => {
      return await ctx.db
        .selectDistinct({
          count: countDistinct(schema.bookingItems.id),
        })
        .from(schema.bookings)
        .innerJoin(
          schema.bookingItems,
          and(
            eq(schema.bookingItems.bookingId, schema.bookings.id),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            inArray(schema.bookingItems.status, statuses as any),
          ),
        )
        .innerJoin(
          schema.slots,
          and(
            eq(schema.slots.id, schema.bookingItems.slotId),
            date
              ? between(schema.slots.date, date.startDate, date.endDate)
              : undefined,
          ),
        )
        .where(eq(schema.bookings.centerId, ctx.center.id));
    };

    const today = getDateString();

    const statsArray = await Promise.all([
      getBookingCount(["confirmed"], {
        startDate: today,
        endDate: today,
      }),
      getBookingCount(["booked"]),
      getBookingCount(["ongoing"]),
      getBookingCount(["completed"], {
        startDate: today,
        endDate: today,
      }),
    ]);

    const stats = {
      today: statsArray[0][0]?.count,
      new: statsArray[1][0]?.count,
      active: statsArray[2][0]?.count,
      completed: statsArray[3][0]?.count,
    };

    return stats;
  }),

  getBookingsForCenter: protectedCenterProcedure
    .input(centerApp.booking.GetBookings)
    .query(async ({ ctx, input }) => {
      // Then filter bookings with those ids
      const bookingIdsObj = await ctx.db
        .select({
          id: schema.bookings.id,
        })
        .from(schema.bookings)
        .innerJoin(
          schema.bookingItems,
          and(
            eq(schema.bookingItems.bookingId, schema.bookings.id),
            // Check if bookingItems status is equal to the input status
            input.status
              ? inArray(schema.bookingItems.status, input.status)
              : undefined,
          ),
        )
        .innerJoin(
          schema.slots,
          and(
            eq(schema.slots.id, schema.bookingItems.slotId),
            // If date is provided, get booking ids for booking_item with slot date between startDate and endDate
            input.date
              ? between(
                  schema.slots.date,
                  input.date.startDate,
                  input.date.endDate,
                )
              : undefined,
          ),
        )
        .where(and(eq(schema.bookings.centerId, ctx.center.id)));

      const bookingIds = bookingIdsObj.map((booking) => booking.id);

      if (bookingIds.length === 0) {
        return [];
      }

      const bookings = ctx.db.query.bookings.findMany({
        where: inArray(schema.bookings.id, bookingIds),
        orderBy: asc(schema.bookings.createdAt),
        with: {
          user: {
            columns: { name: true, phoneNumber: true },
          },
          address: true,
          items: {
            with: {
              service: {
                columns: {
                  name: true,
                  id: true,
                  publicId: true,
                  price: true,
                  serviceType: true,
                },
              },
              slot: { columns: { id: true, date: true, startTime: true } },
              pet: { columns: { id: true, type: true, name: true } },
            },
          },
        },
      });

      return bookings;
    }),

  acceptBookingItem: protectedCenterProcedure
    .input(centerApp.booking.AcceptBookingItem)
    .mutation(async ({ ctx, input }) => {
      const bookingItem = await ctx.db
        .update(schema.bookingItems)
        .set({
          status: "confirmed",
        })
        .where(
          and(
            eq(schema.bookingItems.bookingId, input.bookingId),
            eq(schema.bookingItems.id, input.bookingItemId),
          ),
        )
        .returning();

      if (!bookingItem) {
        throw new Error("Booking not found");
      }
    }),

  startBookingItem: protectedCenterProcedure
    .input(centerApp.booking.AcceptBookingItem)
    .mutation(async ({ ctx, input }) => {
      const bookingItem = await ctx.db
        .update(schema.bookingItems)
        .set({
          status: "ongoing",
        })
        .where(
          and(
            eq(schema.bookingItems.bookingId, input.bookingId),
            eq(schema.bookingItems.id, input.bookingItemId),
          ),
        )
        .returning();

      if (!bookingItem) {
        throw new Error("Booking not found");
      }
    }),

  completeBookingItem: protectedCenterProcedure
    .input(centerApp.booking.AcceptBookingItem)
    .mutation(async ({ ctx, input }) => {
      const bookingItem = await ctx.db
        .update(schema.bookingItems)
        .set({
          status: "completed",
        })
        .where(
          and(
            eq(schema.bookingItems.bookingId, input.bookingId),
            eq(schema.bookingItems.id, input.bookingItemId),
          ),
        )
        .returning();

      if (!bookingItem) {
        throw new Error("Booking not found");
      }
    }),
  cancelBookingItem: protectedCenterProcedure
    .input(centerApp.booking.AcceptBookingItem)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (trx) => {
        // Update booking item status to center_cancelled
        const bookingItemId = (
          await trx
            .update(schema.bookingItems)
            .set({
              status: "center_cancelled",
            })
            .where(
              and(
                eq(schema.bookingItems.id, input.bookingItemId),
                eq(schema.bookingItems.status, "booked"),
                eq(schema.bookingItems.bookingId, input.bookingId),
              ),
            )
            .returning({ id: schema.bookingItems.id })
        )?.[0]?.id;

        // If booking item is not found, throw error
        if (!bookingItemId) {
          throw new Error(
            "There is some issue with the cancellation of the booking.",
          );
        }

        // Get booking item details with slots and services. This is required to update the available slots.
        const bookingItem = await trx.query.bookingItems.findFirst({
          where: eq(schema.bookingItems.id, bookingItemId),
          with: {
            service: true,
            slot: true,
          },
        });

        // Get surrounding times for the slot
        const surroundingTimes = getSurroundingTime(
          bookingItem!.slot!.startTime,
          bookingItem!.service.duration - SLOT_DURATION_IN_MINS,
        );

        // Get affected services with the same service type of the cancelled booking item.
        // This is required to update the available slots of all the services with the same service type.
        const affectedServices = await trx
          .select({ id: schema.services.id })
          .from(schema.services)
          .where(
            and(
              eq(schema.services.centerId, bookingItem!.service.centerId),
              eq(schema.services.serviceType, bookingItem!.service.serviceType),
            ),
          );

        const affectedServiceIds = affectedServices.map(
          (service) => service.id,
        );

        // Update available slots for the affected services and
        // surrounding times for the cancelled booking item date.
        await trx
          .update(schema.slots)
          .set({
            availableSlots: sql`${schema.slots.availableSlots} + 1`,
          })
          .where(
            and(
              inArray(schema.slots.serviceId, affectedServiceIds),
              inArray(schema.slots.startTime, surroundingTimes),
              eq(schema.slots.date, bookingItem!.slot!.date),
            ),
          );
      });
    }),
};

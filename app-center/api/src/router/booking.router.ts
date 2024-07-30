import {
  and,
  between,
  countDistinct,
  desc,
  eq,
  inArray,
  schema,
} from "@petzo/db";
import { getDateString } from "@petzo/utils/time";
import { centerApp } from "@petzo/validators";

import { protectedCenterProcedure } from "../trpc";

export const bookingRouter = {
  getDashboardBookingStats: protectedCenterProcedure.query(async ({ ctx }) => {
    const getBookingCount = async (
      status: string,
      date?: { startDate: string; endDate: string },
    ) => {
      return await ctx.db
        .selectDistinct({
          count: countDistinct(schema.bookings.id),
        })
        .from(schema.bookings)
        .innerJoin(
          schema.bookingItems,
          eq(schema.bookingItems.bookingId, schema.bookings.id),
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
        .where(
          and(
            eq(schema.bookings.centerId, ctx.center.id),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            eq(schema.bookings.status, status as any),
          ),
        );
    };

    const today = getDateString();

    const statsArray = await Promise.all([
      getBookingCount("confirmed", {
        startDate: today,
        endDate: today,
      }),
      getBookingCount("booked"),
      getBookingCount("ongoing"),
      getBookingCount("completed", {
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
      // Get bookings for center
      let whereClause = and(
        eq(schema.bookings.centerId, ctx.center.id),
        input.status ? eq(schema.bookings.status, input.status) : undefined,
      );

      // If date is provided, get booking ids for booking_item with slot date between startDate and endDate
      // Then filter bookings with those ids
      if (input.date) {
        const bookingIdsObj = await ctx.db
          .select({
            id: schema.bookings.id,
          })
          .from(schema.bookings)
          .innerJoin(
            schema.bookingItems,
            eq(schema.bookingItems.bookingId, schema.bookings.id),
          )
          .innerJoin(
            schema.slots,
            and(
              eq(schema.slots.id, schema.bookingItems.slotId),
              between(
                schema.slots.date,
                input.date.startDate,
                input.date.endDate,
              ),
            ),
          )
          .where(
            and(
              eq(schema.bookings.centerId, ctx.center.id),
              input.status
                ? eq(schema.bookings.status, input.status)
                : undefined,
            ),
          );

        const bookingIds = bookingIdsObj.map((booking) => booking.id);

        if (bookingIds.length === 0) {
          return [];
        }

        whereClause = inArray(schema.bookings.id, bookingIds);
      }

      const bookings = ctx.db.query.bookings.findMany({
        where: whereClause,
        orderBy: desc(schema.bookings.createdAt),
        with: {
          user: {
            columns: { name: true },
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

  acceptBooking: protectedCenterProcedure
    .input(centerApp.booking.AcceptBooking)
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.db.transaction(async (trx) => {
        const booking = await trx
          .update(schema.bookings)
          .set({
            status: "confirmed",
          })
          .where(
            and(
              eq(schema.bookings.id, input.bookingId),
              eq(schema.bookings.centerId, ctx.center.id),
            ),
          )
          .returning();

        await trx
          .update(schema.bookingItems)
          .set({
            status: "confirmed",
          })
          .where(and(eq(schema.bookingItems.bookingId, input.bookingId)))
          .returning();

        throw new Error("Booking not found");

        return booking;
      });

      if (!booking) {
        throw new Error("Booking not found");
      }
    }),
};

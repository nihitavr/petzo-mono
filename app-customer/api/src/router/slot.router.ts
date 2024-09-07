import { format, isBefore, isEqual, setHours, setMinutes } from "date-fns";
import { z } from "zod";

import type { Service, Slot } from "@petzo/db";
import { SLOT_DURATION_IN_MINS } from "@petzo/constants";
import { and, asc, eq, inArray, schema } from "@petzo/db";
import { timeUtils } from "@petzo/utils";
import {
  getNextNDaysString,
  isTimeAfterOrEqual,
  isTimeBefore,
} from "@petzo/utils/time";

import { publicProcedure } from "../trpc";

const MAX_RETRIES = 3;

export const slotRouter = {
  getDateToSlotsMap: publicProcedure
    .input(z.object({ serviceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const next7Dates = getNextNDaysString(7);

      // Fetch slots and service in parallel
      const [slots, service] = await Promise.all([
        ctx.db.query.slots.findMany({
          where: and(
            eq(schema.slots.serviceId, input.serviceId),
            inArray(schema.slots.date, next7Dates),
          ),
          orderBy: [asc(schema.slots.date), asc(schema.slots.startTime)],
        }),
        ctx.db.query.services.findFirst({
          where: eq(schema.services.id, input.serviceId),
          with: { center: true },
        }),
      ]);

      if (!service) throw new Error("Service not found");

      const dateToSlotsMap = new Map<string, typeof slots>();

      // Populate dateToSlotsMap and track missing dates in one loop
      const missingDates = new Set(next7Dates);

      for (const slot of slots) {
        const date = slot.date.toString();
        if (!dateToSlotsMap.has(date)) {
          dateToSlotsMap.set(date, []);
          missingDates.delete(date);
        }
        dateToSlotsMap.get(date)!.push(slot);
      }

      // Get available days from operating hours using service config
      const availableDays = new Set(
        Object.entries(service.config?.operatingHours ?? {})
          .filter(([, value]) => {
            return value !== null;
          })
          .map(([key]) => key),
      );

      // Remove dates that are not available in operating hours
      for (const date of missingDates) {
        if (!availableDays.has(timeUtils.getDayFromDate(date))) {
          missingDates.delete(date);
        }
      }

      // Create new slots if necessary
      if (missingDates.size > 0) {
        let retries = 0;

        while (retries < MAX_RETRIES) {
          try {
            await ctx.db.transaction(
              async (tx) => {
                const sisterServiceSlots = await tx
                  .select()
                  .from(schema.services)
                  .innerJoin(
                    schema.slots,
                    and(
                      eq(schema.slots.serviceId, schema.services.id),
                      inArray(schema.slots.date, Array.from(missingDates)),
                    ),
                  )
                  .where(
                    and(
                      eq(schema.services.centerId, service.center.id),
                      eq(schema.services.serviceType, service.serviceType),
                    ),
                  )
                  .orderBy(
                    asc(schema.slots.serviceId),
                    asc(schema.slots.date),
                    asc(schema.slots.startTime),
                  );

                const dateToStartTimeToSlots = sisterServiceSlots.reduce(
                  (acc, curr) => {
                    if (!acc?.has(curr.slot.date)) {
                      acc.set(curr.slot.date, new Map());
                    }

                    acc
                      ?.get(curr.slot.date)
                      ?.set(curr.slot.startTime, curr.slot.availableSlots);

                    return acc;
                  },
                  new Map<string, Map<string, number>>(),
                );

                const newSlotsList = slotRouterUtils.getSlotInsertData(
                  Array.from(missingDates),
                  service,
                  dateToStartTimeToSlots,
                );

                if (newSlotsList?.length) {
                  await tx
                    .insert(schema.slots)
                    .values(newSlotsList)
                    .onConflictDoNothing();

                  const newSlots = await tx
                    .select()
                    .from(schema.slots)
                    .where(
                      and(
                        eq(schema.slots.serviceId, input.serviceId),
                        inArray(schema.slots.date, Array.from(missingDates)),
                      ),
                    )
                    .orderBy(
                      asc(schema.slots.date),
                      asc(schema.slots.startTime),
                    );

                  for (const slot of newSlots) {
                    const date = slot.date.toString();
                    if (!dateToSlotsMap.has(date)) dateToSlotsMap.set(date, []);
                    dateToSlotsMap.get(date)!.push(slot);
                  }
                }
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
      }

      return dateToSlotsMap;
    }),
  getSlotsByIds: publicProcedure
    .input(z.object({ slotIds: z.array(z.number()) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.slots.findMany({
        where: inArray(schema.slots.id, input.slotIds),
      });
    }),
};

const slotRouterUtils = {
  /*
   * Get available slots from scheduled slots.
   * 1. If for a given date, if there are no scheduled slots, return undefined.
   * 2. If for a given date, if there is a slot that is greater or equal to the given time (first time sorted in order), return its available slots.
   * 3. If for a given date, if there is no slot that is greater or equal to the given time, return undefined.
   */
  getAvailableSlotsFromScheduledSlots: (
    scheduledSlotTimes: Map<string, Map<string, number>>,
    date: string,
    time: string,
  ): number | undefined => {
    if (!scheduledSlotTimes.has(date)) return;

    const timesForDate = scheduledSlotTimes.get(date);
    const times = Array.from(timesForDate!.keys());
    const sortedTimes = times.sort((a, b) => (isTimeBefore(a, b) ? -1 : 1));

    for (const [idx, scheduledTime] of sortedTimes.entries()) {
      if (
        isTimeAfterOrEqual(time, scheduledTime) &&
        (!sortedTimes[idx + 1] || isTimeBefore(time, sortedTimes[idx + 1]))
      ) {
        return timesForDate?.get(scheduledTime);
      }
    }

    return;
  },

  getSlotInsertData: (
    datesStr: string[],
    service: Service,
    scheduledSlotTimes: Map<string, Map<string, number>>,
  ): Slot[] => {
    const slotInsertData: Slot[] = [];

    const startTimeHours = parseInt(service.startTime.split(":")[0]!);
    const startTimeMinutes = parseInt(service.startTime.split(":")[1]!);

    const startTimeEndHours = parseInt(service.startTimeEnd.split(":")[0]!);
    const startTimeEndMinutes = parseInt(service.startTimeEnd.split(":")[1]!);

    datesStr.forEach((dateStr) => {
      const startTimeDate = setMinutes(
        setHours(new Date(dateStr), startTimeHours),
        startTimeMinutes,
      );
      const startTimeDateEnd = setMinutes(
        setHours(new Date(dateStr), startTimeEndHours),
        startTimeEndMinutes,
      );

      while (
        isBefore(startTimeDate, startTimeDateEnd) ||
        isEqual(startTimeDate, startTimeDateEnd)
      ) {
        const time = format(startTimeDate, "HH:mm:ss");
        const totalSlots =
          service.center!.config?.services[service.serviceType]
            ?.noOfParallelServices ?? 1;
        const availableSlots =
          slotRouterUtils.getAvailableSlotsFromScheduledSlots(
            scheduledSlotTimes,
            dateStr,
            time,
          ) ??
          service.center!.config?.services[service.serviceType]
            ?.noOfParallelServices ??
          1;

        slotInsertData.push({
          serviceId: service.id,
          centerId: service.centerId,
          totalSlots: totalSlots,
          availableSlots: availableSlots,
          date: dateStr,
          startTime: time,
        } as unknown as Slot);

        startTimeDate.setMinutes(
          startTimeDate.getMinutes() + SLOT_DURATION_IN_MINS,
        );
      }
    });

    return slotInsertData;
  },
};

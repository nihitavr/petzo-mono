import { format, isBefore, isEqual, setHours, setMinutes } from "date-fns";
import { z } from "zod";

import type { Service, Slot } from "@petzo/db";
import { SLOT_DURATION_IN_MINS } from "@petzo/constants";
import { and, asc, eq, inArray, schema } from "@petzo/db";
import { timeUtils } from "@petzo/utils";
import { getNextNDaysString } from "@petzo/utils/time";

import { publicProcedure } from "../trpc";

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

      const availableDays = new Set(
        Object.entries(service.config?.operatingHours ?? {})
          .filter(([, value]) => {
            return value !== null;
          })
          .map(([key]) => key),
      );

      // Remove dates that are not available
      for (const date of missingDates) {
        if (!availableDays.has(timeUtils.getDayFromDate(date))) {
          missingDates.delete(date);
        }
      }

      // Create new slots if necessary
      if (missingDates.size > 0) {
        const newSlotsList = slotRouterUtils.getSlotInsertData(
          Array.from(missingDates),
          service,
        );

        if (newSlotsList?.length) {
          await ctx.db
            .insert(schema.slots)
            .values(newSlotsList)
            .onConflictDoNothing();

          const newSlots = await ctx.db
            .select()
            .from(schema.slots)
            .where(
              and(
                eq(schema.slots.serviceId, input.serviceId),
                inArray(schema.slots.date, Array.from(missingDates)),
              ),
            )
            .orderBy(asc(schema.slots.date), asc(schema.slots.startTime));

          for (const slot of newSlots) {
            const date = slot.date.toString();
            if (!dateToSlotsMap.has(date)) dateToSlotsMap.set(date, []);
            dateToSlotsMap.get(date)!.push(slot);
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
  getSlotInsertData: (datesStr: string[], service: Service): Slot[] => {
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

        slotInsertData.push({
          serviceId: service.id,
          centerId: service.centerId,
          totalSlots:
            service.center!.config?.services[service.serviceType]
              ?.noOfParallelServices ?? 1,
          availableSlots:
            service.center!.config?.services[service.serviceType]
              ?.noOfParallelServices ?? 1,
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

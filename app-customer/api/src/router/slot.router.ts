import { format, isBefore, isEqual, setHours, setMinutes } from "date-fns";
import { z } from "zod";

import type { Service, Slot } from "@petzo/db";
import { SLOT_DURATION_IN_MINS } from "@petzo/constants";
import { and, asc, eq, inArray, schema } from "@petzo/db";
import { getNextNDaysString } from "@petzo/utils/time";

import { publicProcedure } from "../trpc";

export const slotRouter = {
  getDateToSlotsMap: publicProcedure
    .input(z.object({ serviceId: z.number() }))
    .query(async ({ ctx, input }) => {

      const next7Dates = getNextNDaysString(7);

      const slots = await ctx.db.query.slots.findMany({
        where: and(
          eq(schema.slots.serviceId, input.serviceId),
          inArray(schema.slots.date, next7Dates),
        ),
        orderBy: [asc(schema.slots.date), asc(schema.slots.startTime)],
      });

      const dateToSlotsMap = new Map<string, typeof slots>();

      slots.forEach((slot) => {
        const date = slot.date.toString();
        if (!dateToSlotsMap.has(date)) {
          dateToSlotsMap.set(date, []);
        }
        dateToSlotsMap.get(date)?.push(slot);
      });

      const noSlotAvailableDates = next7Dates.filter(
        (date) => !dateToSlotsMap.has(date),
      );

      // This slot mechanism will only work for services that have 30 minutes slot duration
      if (noSlotAvailableDates.length > 0) {
        const service = await ctx.db.query.services.findFirst({
          where: eq(schema.services.id, input.serviceId),
          with: { center: true },
        });

        if (!service) throw new Error("Service not found");

        const newSlotsList = slotRouterUtils.getSlotInsertData(
          noSlotAvailableDates,
          service,
        );

        if (newSlotsList?.length) {
          const newSlots = await ctx.db
            .insert(schema.slots)
            .values(newSlotsList)
            // .onConflictDoNothing()
            .returning();

          newSlots.forEach((slot) => {
            const date = slot.date.toString();
            if (!dateToSlotsMap.has(date)) {
              dateToSlotsMap.set(date, []);
            }
            dateToSlotsMap.get(date)?.push(slot);
          });
        }
      }

      return dateToSlotsMap;
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
            service.center!.servicesConfig?.homeGrooming.all
              .noOfParallelServices ?? 1,
          availableSlots:
            service.center!.servicesConfig?.homeGrooming.all
              .noOfParallelServices ?? 1,
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

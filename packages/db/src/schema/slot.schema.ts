import { relations, sql } from "drizzle-orm";
import { index, integer, serial, time, timestamp } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centers } from "./center.schema";
import { services } from "./service.schema";
import { slotAvailabilities } from "./slot-availability.schema";

export const slots = pgTable(
  "slot",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    totalSlots: integer("total_slots").notNull(),
    availableSlots: integer("available_slots").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (slot) => ({
    serviceCenterIdx: index("slots_service_center_idx").on(
      slot.serviceId,
      slot.centerId,
    ),
  }),
);

export const slotRelations = relations(slots, ({ one, many }) => ({
  service: one(services, {
    fields: [slots.serviceId],
    references: [services.id],
  }),
  slotAvailabilities: many(slotAvailabilities),
}));

import { relations, sql } from "drizzle-orm";
import { index, integer, serial, timestamp } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { slots } from "./slot.schema";

export const slotAvailabilities = pgTable(
  "slot_availability",
  {
    id: serial("id").primaryKey(),
    slotId: integer("slot_id")
      .notNull()
      .references(() => slots.id),
    date: timestamp("date").notNull(),
    totalSlots: integer("total_slots").notNull(),
    availableSlots: integer("available_slots").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (slotAvailabilities) => ({
    slotAvailabilitiesIdandDateIdx: index(
      "slot_availabilities_id_and_date_idx",
    ).on(slotAvailabilities.slotId, slotAvailabilities.date),
  }),
);

export const slotsAvailabilityRelations = relations(
  slotAvailabilities,
  ({ one }) => ({
    slot: one(slots, {
      fields: [slotAvailabilities.slotId],
      references: [slots.id],
    }),
  }),
);

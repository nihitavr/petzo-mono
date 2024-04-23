import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centers } from "./center.schema";
import { customerUsers } from "./customer-app-auth.schema";
import { pets } from "./pet.schema";

export const petMedicalRecords = pgTable(
  "pet_medical_record",
  {
    id: serial("id").primaryKey(),
    petId: integer("pet_id")
      .notNull()
      .references(() => pets.id),
    centerId: integer("center_id").references(() => centers.id),
    customerUserId: varchar("customer_user_id", { length: 255 }).references(
      () => customerUsers.id,
    ),
    description: text("description"),
    images: json("images").$type<{ url: string }[]>().default([]).notNull(),
    appointmentDate: timestamp("appointment_date").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (petMedicalRecord) => ({
    petMedicalRecordsPetAppointmentDateIdx: index(
      "pet_medical_records_pet_appointment_date_idx",
    ).on(petMedicalRecord.petId, petMedicalRecord.appointmentDate),
    petMedicalRecordsCenterIdx: index("pet_medical_records_center_idx").on(
      petMedicalRecord.centerId,
    ),
  }),
);

export const petMedicalRecordRelations = relations(
  petMedicalRecords,
  ({ one }) => ({
    pet: one(pets, {
      fields: [petMedicalRecords.petId],
      references: [pets.id],
    }),
  }),
);

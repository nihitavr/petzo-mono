import { sql } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { PET_GENDER, PET_TYPE_VALUES } from "@petzo/constants";

import { pgTable } from "./_table";
import { customerUsers } from "./customer-app-auth.schema";

export const petTypeEnum = pgEnum("pet_type_enum_type", PET_TYPE_VALUES);

export const genderEnum = pgEnum("gender_enum_type", PET_GENDER);

export const pets = pgTable(
  "pet",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 20 }).notNull().unique(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    type: petTypeEnum("type"),
    gender: genderEnum("gender"),
    images: json("images").$type<{ url: string }[]>(),
    behaviourTags: json("behaviour_tags").$type<string[]>(),
    breed: varchar("breed", { length: 256 }),
    dateOfBirth: timestamp("date_of_birth"),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (pet) => ({
    userIdx: index("pets_user_idx").on(pet.customerUserId),
  }),
);

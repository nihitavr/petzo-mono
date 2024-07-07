import { sql } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { customerUsers } from "./customer-app-auth.schema";

export const petTypeEnum = pgEnum("pet_type_enum_type", [
  "cat",
  "small_dog",
  "big_dog",
]);

export const genderEnum = pgEnum("gender_enum_type", ["male", "female"]);

export const GenderList = genderEnum.enumValues;
export const PetTypeList = petTypeEnum.enumValues;

export const pets = pgTable(
  "pet",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 15 }).notNull().unique(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),
    name: varchar("name", { length: 256 }).notNull(),
    type: petTypeEnum("type"),
    gender: genderEnum("gender"),
    images: json("images").$type<{ url: string }[]>(),
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

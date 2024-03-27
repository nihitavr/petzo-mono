import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centerUsers } from "./center-app-auth-schema";
import { customerUsers } from "./customer-app-auth-schema";

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 256 }).notNull(),
  content: varchar("content", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const centers = pgTable(
  "center",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 13 }).notNull().unique(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    addressId: integer("address_id")
      .notNull()
      .references(() => centerAddresses.id),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
  },
  (center) => ({
    addressIdx: index("center_address_idx").on(center.addressId),
    userIdx: index("center_user_idx").on(center.centerUserId),
  }),
);

export const centerAddresses = pgTable("center_address", {
  id: serial("id").primaryKey(),
  line1: varchar("line1", { length: 256 }).notNull(),
  pincode: varchar("pincode", { length: 20 }).notNull(),
  geocode: varchar("geocode", { length: 256 }),
  city: varchar("city", { length: 256 }).notNull(),
  state: varchar("state", { length: 256 }).notNull(),
});

export const vets = pgTable(
  "vet",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    qualifications: text("qualifications"),
  },
  (vet) => ({
    centerIdx: index("vet_center_idx").on(vet.centerId),
  }),
);
export const staff = pgTable(
  "staff",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
    type: varchar("type", { length: 256 }).notNull(),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
  },
  (staff) => ({
    centerIdx: index("staff_center_idx").on(staff.centerId),
  }),
);

export const reviews = pgTable(
  "review",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    text: text("text").notNull(),
  },
  (review) => ({
    userCenterIdx: index("reviews_user_center_idx").on(
      review.centerId,
      review.customerUserId,
    ),
  }),
);
export const ratings = pgTable(
  "rating",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),

    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    rating: integer("rating").notNull(),
  },
  (rating) => ({
    userCenterIdx: index("ratings_user_center_idx").on(
      rating.customerUserId,
      rating.centerId,
    ),
  }),
);

export const services = pgTable(
  "service",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    category: varchar("category", { length: 256 }).notNull(),
    price: integer("price").notNull(),
    description: text("description"),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
  },
  (service) => ({
    centerIdx: index("services_center_idx").on(service.centerId),
  }),
);
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
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    totalSlots: integer("total_slots").notNull(),
    availableSlots: integer("available_slots").notNull(),
  },
  (slot) => ({
    serviceCenterIdx: index("slots_service_center_idx").on(
      slot.serviceId,
      slot.centerId,
    ),
  }),
);

export const pets = pgTable(
  "pet",
  {
    id: serial("id").primaryKey(),
    publicId: varchar("public_id", { length: 13 }).notNull().unique(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),

    name: varchar("name", { length: 256 }).notNull(),
    type: varchar("type", { length: 256 }).notNull(),
    breed: varchar("breed", { length: 256 }).notNull(),
    dateOfBirth: timestamp("date_of_birth"),
    description: text("description"),
  },
  (pet) => ({
    userIdx: index("pets_user_idx").on(pet.customerUserId),
  }),
);
export const bookings = pgTable(
  "booking",
  {
    id: serial("id").primaryKey(),
    customerUserId: varchar("customer_user_id", { length: 255 })
      .notNull()
      .references(() => customerUsers.id),

    petId: integer("pet_id")
      .notNull()
      .references(() => pets.id),
    slotId: integer("slot_id")
      .notNull()
      .references(() => slots.id),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    amount: integer("amount").notNull(),
    isPaid: boolean("is_paid").notNull(),
    status: varchar("status", { length: 256 }).notNull(),
  },
  (booking) => ({
    userPetIdx: index("bookings_user_pet_idx").on(
      booking.customerUserId,
      booking.petId,
    ),
    serviceCenterIdx: index("bookings_service_center_idx").on(
      booking.serviceId,
      booking.centerId,
    ),
  }),
);

import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { centerUsers } from "./center-app-auth-schema";
import { customerUsers } from "./customer-app-auth-schema";

export const serviceTypeEnum = pgEnum("center_service_type", [
  "veterinary",
  "grooming",
  "boarding",
]);

export const serviceTypeList = serviceTypeEnum.enumValues;

export const states = pgTable(
  "state",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    alpha2Code: varchar("alpha2_code", { length: 5 }).notNull(),
    isActive: boolean("is_active").default(false).notNull(),
  },
  (state) => ({
    alpha2CodeIdx: uniqueIndex("state_alpha2_code_idx").on(state.alpha2Code),
  }),
);

export const cities = pgTable("city", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  public_id: varchar("public_id", { length: 30 }).unique(),
  stateId: integer("state_id")
    .notNull()
    .references(() => states.id),
});

export const areas = pgTable("area", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  public_id: varchar("public_id", { length: 40 }).unique(),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id),
});

export const post = pgTable("post", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 256 }).notNull(),
  content: varchar("content", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
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
    images: json("images").$type<[{ url: string }]>(),
    averageRating: integer("average_rating").default(0).notNull(),
    centerAddressId: integer("center_address_id")
      .notNull()
      .references(() => centerAddresses.id),
    centerUserId: varchar("center_user_id", { length: 255 })
      .notNull()
      .references(() => centerUsers.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (center) => ({
    centerPublicIdIdx: index("center_public_id_idx").on(center.publicId),
    centerUserIdIdx: index("center_user_idx").on(center.centerUserId),
  }),
);

export const centerRelations = relations(centers, ({ one, many }) => ({
  centerAddress: one(centerAddresses, {
    fields: [centers.centerAddressId],
    references: [centerAddresses.id],
  }),
  services: many(services),
}));

export type Center = InferSelectModel<typeof centers>;

export const centerAddresses = pgTable("center_address", {
  id: serial("id").primaryKey(),
  line1: varchar("line1", { length: 256 }).notNull(),
  pincode: varchar("pincode", { length: 6 }).notNull(),
  geocode: json("geocode").$type<{ latitude: number; longitude: number }>(),
  areaId: integer("area_id")
    .notNull()
    .references(() => areas.id),
  cityId: integer("city_id")
    .notNull()
    .references(() => cities.id),
  stateId: integer("state_id")
    .notNull()
    .references(() => states.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const centerAddressRelations = relations(centerAddresses, ({ one }) => ({
  area: one(areas, {
    fields: [centerAddresses.areaId],
    references: [areas.id],
  }),
  city: one(cities, {
    fields: [centerAddresses.cityId],
    references: [cities.id],
  }),
  state: one(states, {
    fields: [centerAddresses.stateId],
    references: [states.id],
  }),
}));

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
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (vet) => ({
    cetCenterIdx: index("vet_center_idx").on(vet.centerId),
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
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
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
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (review) => ({
    reviewsUserCenterIdx: index("reviews_user_center_idx").on(
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
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
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
    serviceType: serviceTypeEnum("service_type").notNull(),
    price: integer("price").notNull(),
    description: text("description"),
    centerId: integer("center_id")
      .notNull()
      .references(() => centers.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (service) => ({
    centerIdx: index("services_center_idx").on(service.centerId),
  }),
);

export const servicesRelations = relations(services, ({ one }) => ({
  center: one(centers, {
    fields: [services.centerId],
    references: [centers.id],
  }),
}));

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
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
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
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
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

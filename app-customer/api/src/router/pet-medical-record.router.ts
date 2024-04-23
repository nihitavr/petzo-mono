import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq, schema } from "@petzo/db";
import { petMedicalRecordsValidator } from "@petzo/validators";

import { protectedProcedure } from "../trpc";

export const petMedicalRecordRouter = {
  getPetMedicalRecord: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const petMedicalRecord = await ctx.db.query.petMedicalRecords.findFirst({
        where: eq(schema.petMedicalRecords.id, input.id),
        with: {
          pet: true,
        },
      });

      if (petMedicalRecord?.pet.customerUserId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return petMedicalRecord;
    }),

  getPetMedicalRecords: protectedProcedure
    .input(
      z.object({
        petPublicId: z.string().length(15),
        pagination: z.object({
          limit: z.number().int().max(20).positive(),
          page: z.number().int().nonnegative(),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const pet = await ctx.db.query.pets.findFirst({
        where: and(
          eq(schema.pets.customerUserId, ctx.session.user.id),
          eq(schema.pets.publicId, input.petPublicId),
        ),
      });

      if (!pet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
      }

      return ctx.db.query.petMedicalRecords.findMany({
        where: eq(schema.petMedicalRecords.petId, pet.id),
        orderBy: [desc(schema.petMedicalRecords.appointmentDate)],
        limit: input.pagination.limit,
        offset: input.pagination.page * input.pagination.limit,
      });
    }),

  insertPetMedicalRecord: protectedProcedure
    .input(petMedicalRecordsValidator.InsertSchema)
    .mutation(async ({ ctx, input }) => {
      const pet = await ctx.db.query.pets.findFirst({
        where: and(
          eq(schema.pets.customerUserId, ctx.session.user.id),
          eq(schema.pets.publicId, input.petPublicId),
        ),
      });

      if (!pet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
      }

      const medicalRecord = (
        await ctx.db
          .insert(schema.petMedicalRecords)
          .values({
            petId: pet.id,
            centerId: input.centerId,
            images: input.images,
            appointmentDate: input.appointmentDate,
          })
          .returning()
      )?.[0];

      if (!medicalRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medical record not found",
        });
      }

      return medicalRecord;
    }),

  updatePetMedicalRecord: protectedProcedure
    .input(petMedicalRecordsValidator.UpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const pet = await ctx.db.query.pets.findFirst({
        where: and(
          eq(schema.pets.customerUserId, ctx.session.user.id),
          eq(schema.pets.publicId, input.petPublicId),
        ),
      });

      if (!pet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pet not found" });
      }

      const medicalRecord = (
        await ctx.db
          .update(schema.petMedicalRecords)
          .set({
            centerId: input.centerId,
            images: input.images,
            appointmentDate: input.appointmentDate,
          })
          .where(
            and(
              eq(schema.petMedicalRecords.id, input.id),
              eq(schema.petMedicalRecords.petId, pet.id),
            ),
          )
          .returning()
      )?.[0];

      if (!medicalRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Medical record not found",
        });
      }

      return medicalRecord;
    }),
};

"use client";

import type * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { LuCalendar } from "react-icons/lu";

import type { Pet, PetMedicalRecord } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { Calendar } from "@petzo/ui/components/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@petzo/ui/components/form";
import { ImageInput } from "@petzo/ui/components/image-input";
import { Label } from "@petzo/ui/components/label";
import Loader from "@petzo/ui/components/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@petzo/ui/components/popover";
import { Textarea } from "@petzo/ui/components/textarea";
import { toast } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";
import { petMedicalRecordsValidator } from "@petzo/validators";

import { DEFAULT_MAX_MEDICAL_RECORD_IMAGES } from "~/lib/constants";
import { api } from "~/trpc/react";

type PetMedicalRecordInsertSchema = z.infer<
  typeof petMedicalRecordsValidator.InsertSchema
>;

type PetMedicalRecordUpdateSchema = z.infer<
  typeof petMedicalRecordsValidator.UpdateSchema
>;

export function MedicalRecordsForm({
  defaultPetPublicId,
  pets,
  petMedicalRecord,
}: {
  defaultPetPublicId?: string;
  pets: Pet[];
  petMedicalRecord?: PetMedicalRecord;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<
    PetMedicalRecordInsertSchema | PetMedicalRecordUpdateSchema
  >({
    resolver: zodResolver(petMedicalRecordsValidator.InsertSchema),
    defaultValues: {
      petPublicId: defaultPetPublicId ?? "",
      description: petMedicalRecord?.description ?? "",
      images: petMedicalRecord?.images ?? [],
      appointmentDate: petMedicalRecord?.appointmentDate ?? new Date(),
    },
  });

  const addMedicalRecord =
    api.petMedicalRecord.insertPetMedicalRecord.useMutation();
  const updateMedicalRecord =
    api.petMedicalRecord.updatePetMedicalRecord.useMutation();

  const onSuccess = () => {
    toast.success("Owner Profile updated successfully!");
  };

  const onSubmit = async (
    values: PetMedicalRecordInsertSchema | PetMedicalRecordUpdateSchema,
  ) => {
    setIsSubmitting(true);

    if (petMedicalRecord) {
      await updateMedicalRecord.mutateAsync(
        values as PetMedicalRecordUpdateSchema,
        {
          onSuccess: () => onSuccess(),
          onError: (error) => toast.error(error.message),
        },
      );
    } else {
      await addMedicalRecord.mutateAsync(
        values as PetMedicalRecordInsertSchema,
        {
          onSuccess: () => onSuccess(),
          onError: (error) => toast.error(error.message),
        },
      );
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-5">
        {/* Calendar */}
        <FormField
          control={form.control}
          name="appointmentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Label>Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <LuCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? new Date()}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe medical record" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescription Images</FormLabel>
              <div className="flex flex-col items-start gap-2">
                <FormControl>
                  <ImageInput
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    objectFit="contain"
                    clearErrors={form.clearErrors}
                    setError={form.setError}
                    ratio={1 / 1.41}
                    maxFiles={DEFAULT_MAX_MEDICAL_RECORD_IMAGES}
                    handleUploadUrl="/api/medical-record-image/upload"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div
          className={`md:initial fixed bottom-0 left-0 z-50 flex w-full justify-end px-3 py-3 md:static`}
        >
          <Button
            className="flex w-full items-center justify-center gap-2 md:w-32"
            type="submit"
            disabled={
              Object.keys(form.formState.dirtyFields).length == 0 ||
              isSubmitting
            }
          >
            <span>Save</span>
            <div>
              <Loader className="h-5 w-5 border-2" show={isSubmitting} />
            </div>
          </Button>
        </div>
      </form>
    </Form>
  );
}

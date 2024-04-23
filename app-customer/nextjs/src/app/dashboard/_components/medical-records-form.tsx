"use client";

import type * as z from "zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { LuCalendar, LuCheck, LuChevronsUpDown } from "react-icons/lu";

import type { Pet, PetMedicalRecord } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { Calendar } from "@petzo/ui/components/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@petzo/ui/components/command";
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
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<
    PetMedicalRecordInsertSchema | PetMedicalRecordUpdateSchema
  >({
    resolver: zodResolver(
      petMedicalRecord
        ? petMedicalRecordsValidator.UpdateSchema
        : petMedicalRecordsValidator.InsertSchema,
    ),
    defaultValues: {
      id: petMedicalRecord?.id,
      petPublicId: petMedicalRecord?.pet?.publicId,
      description: petMedicalRecord?.description ?? "",
      images: petMedicalRecord?.images ?? [],
      appointmentDate: petMedicalRecord?.appointmentDate ?? new Date(),
    },
  });

  useEffect(() => {
    if (!petMedicalRecord) {
      form.setValue("petPublicId", defaultPetPublicId ?? "", {
        shouldDirty: true,
      });
    }
  }, []);

  const addMedicalRecord =
    api.petMedicalRecord.insertPetMedicalRecord.useMutation();
  const updateMedicalRecord =
    api.petMedicalRecord.updatePetMedicalRecord.useMutation();

  const onSuccess = (values: PetMedicalRecord) => {
    const pet = pets.find((pet) => pet.id === values.petId);

    if (petMedicalRecord) {
      toast.success("Successfully updated pet medical record!");
      form.reset({
        id: values.id,
        petPublicId: pet?.publicId,
        appointmentDate: values.appointmentDate,
        description: values.description!,
        images: values.images,
      });
    } else {
      toast.success("Successfully create pet medical record!");
      router.push(`/dashboard/medical-records/${values.id}/edit`);
    }
  };

  const onSubmit = async (
    values: PetMedicalRecordInsertSchema | PetMedicalRecordUpdateSchema,
  ) => {
    setIsSubmitting(true);

    if (petMedicalRecord) {
      await updateMedicalRecord.mutateAsync(
        values as PetMedicalRecordUpdateSchema,
        {
          onSuccess: (data) => onSuccess(data),
          onError: (error) => toast.error(error.message),
        },
      );
    } else {
      await addMedicalRecord.mutateAsync(
        values as PetMedicalRecordInsertSchema,
        {
          onSuccess: (data) => onSuccess(data),
          onError: (error) => toast.error(error.message),
        },
      );
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" space-y-5 py-5 pb-16"
      >
        <FormField
          control={form.control}
          name="petPublicId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Pet</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between rounded-lg md:w-40",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? pets.find((pet) => pet.publicId === field.value)?.name
                        : "Select pet"}
                      <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search pet..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {pets.map((pet) => (
                          <CommandItem
                            value={pet.publicId}
                            key={pet.publicId}
                            onSelect={() => {
                              form.setValue("petPublicId", pet.publicId, {
                                shouldDirty: true,
                              });
                            }}
                          >
                            <LuCheck
                              className={cn(
                                "mr-2 h-4 w-4",
                                pet.publicId === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {pet.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Prescription Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Prescription Images (Max {DEFAULT_MAX_MEDICAL_RECORD_IMAGES}{" "}
                images)
              </FormLabel>
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-32"
                  placeholder="Describe medical record"
                  {...field}
                />
              </FormControl>
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

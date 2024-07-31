"use client";

import type { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { LuCalendar } from "react-icons/lu";
import { TbGenderFemale, TbGenderMale } from "react-icons/tb";

import type { Pet } from "@petzo/db";
import { PET_TYPE_CONFIG } from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import { Calendar } from "@petzo/ui/components/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@petzo/ui/components/form";
import BigDog from "@petzo/ui/components/icons/big-dog";
import Cat from "@petzo/ui/components/icons/cat";
import SmallDog from "@petzo/ui/components/icons/small-dog";
import { ImageInput } from "@petzo/ui/components/image-input";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@petzo/ui/components/popover";
import { RadioGroup, RadioGroupItem } from "@petzo/ui/components/radio-group";
import { toast } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";
import { petValidator } from "@petzo/validators";

import { DEFAULT_MAX_PET_PROFILE_IMAGES } from "~/lib/constants";
import { api } from "~/trpc/react";
import FormSaveButton from "../form-save-button";

type PetProfileSchema = z.infer<typeof petValidator.ProfileSchema>;

export function PetProfileForm({ petProfile }: { petProfile?: Pet }) {
  const router = useRouter();

  const form = useForm({
    schema: petValidator.ProfileSchema,
    defaultValues: {
      publicId: petProfile?.publicId,
      name: petProfile?.name ?? "",
      gender: petProfile?.gender ?? undefined,
      images: petProfile?.images ?? [],
      breed: petProfile?.breed ?? "",
      type: petProfile?.type ?? undefined,
      dateOfBirth: petProfile?.dateOfBirth ?? new Date(),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPet = api.pet.addPetProfile.useMutation();
  const updatePet = api.pet.updatePetProfile.useMutation();

  const onMutateSuccess = (
    data?: Pet | null,
    message = "Pet profile added successfully!",
  ) => {
    if (!data) {
      toast.error(
        "There was an error updating the data. We are looking into it!",
      );
      return;
    }

    toast.success(message);
    router.push("/dashboard/pets");
    router.refresh();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: unknown) => {
    const data = values as PetProfileSchema;

    setIsSubmitting(true);

    if (petProfile) {
      await updatePet.mutateAsync(data, {
        onSuccess: (data) => {
          onMutateSuccess(data, "Pet profile updated successfully!");
        },
      });
    } else {
      await addPet.mutateAsync(data, {
        onSuccess: (data) => {
          onMutateSuccess(data, "Pet profile created successfully!");
        },
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 p-1 pb-16"
      >
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl font-semibold">
            {petProfile ? `So what's new about ` : "Tell us about your "}
            <span className="text-primary/90">
              {petProfile ? `${form.getValues()?.name}?` : `Pet!`}
            </span>
          </h1>
        </div>

        <div className="flex flex-col gap-5">
          {/* Profile Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photos</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <ImageInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      objectFit="contain"
                      clearErrors={form.clearErrors}
                      setError={form.setError}
                      ratio={1}
                      maxFiles={DEFAULT_MAX_PET_PROFILE_IMAGES}
                      // handleUploadUrl="/api/profile-image/upload"
                      handleUploadUrl="/api/medical-record-image/upload"
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pet Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Pet Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pet Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    className="flex flex-row items-center gap-3"
                  >
                    {Object.entries(PET_TYPE_CONFIG).map(([petType, label]) => {
                      let Icon = Cat;
                      if (petType == "small_dog") Icon = SmallDog;
                      if (petType == "big_dog") Icon = BigDog;

                      return (
                        <FormItem key={petType} className="space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              value={petType}
                              className="peer hidden"
                            />
                          </FormControl>
                          <FormLabel
                            className={`flex h-9 cursor-pointer items-center gap-1 rounded-md border p-2 font-normal ${field.value == petType ? "bg-primary/30" : "hover:bg-primary/10"}`}
                          >
                            {" "}
                            <span className="whitespace-nowrap">
                              {label}
                            </span>{" "}
                            <Icon />
                          </FormLabel>{" "}
                        </FormItem>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pet Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    className="flex flex-row items-center gap-3"
                  >
                    <FormItem className="space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" className="peer hidden" />
                      </FormControl>
                      <FormLabel
                        className={`flex h-9 cursor-pointer items-center justify-center gap-0.5 rounded-md border p-2 font-normal ${field.value == "male" ? "bg-primary/30" : "hover:bg-primary/10"}`}
                      >
                        <span className="whitespace-nowrap">Male</span>
                        <TbGenderMale className="size-5" />
                      </FormLabel>
                    </FormItem>
                    <FormItem className="space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          value="female"
                          className="peer hidden"
                        />
                      </FormControl>
                      <FormLabel
                        className={`flex h-9 cursor-pointer items-center justify-center gap-0.5 rounded-md border p-2 font-normal ${field.value == "female" ? "bg-primary/30" : "hover:bg-primary/10"}`}
                      >
                        <span className="whitespace-nowrap">Female</span>
                        <TbGenderFemale className="size-5" />
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pet Breed */}
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Persian, Indie, Labrador, German Shepherd etc."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pet Birth Date */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Label>Date of birth</Label>
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
        </div>

        <FormSaveButton
          disabled={Object.keys(form.formState.dirtyFields).length == 0}
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
}

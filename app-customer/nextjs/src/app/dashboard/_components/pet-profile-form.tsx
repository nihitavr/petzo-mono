"use client";

import type { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { LuCalendar } from "react-icons/lu";

import type { Pet } from "@petzo/db";
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
import { ImageDisplay, ImageInput } from "@petzo/ui/components/image-input";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import Loader from "@petzo/ui/components/loader";
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

type PetProfileSchema = z.infer<typeof petValidator.ProfileSchema>;

export function PetProfileForm({ petProfile }: { petProfile?: Pet }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(petValidator.ProfileSchema),
    defaultValues: {
      publicId: petProfile?.publicId ?? "",
      name: petProfile?.name ?? "",
      gender: petProfile?.gender ?? "",
      images: petProfile?.images?.map((image) => image.url) ?? [],
      breed: petProfile?.breed ?? "",
      type: petProfile?.type ?? "",
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
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    const data = values as unknown as PetProfileSchema;

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
        className="flex min-h-[100vh] flex-col gap-3 p-1 pb-16"
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
                  <ImageDisplay {...field} className="h-28 w-28" />
                  <FormControl>
                    <ImageInput
                      {...form}
                      {...field}
                      maxFiles={DEFAULT_MAX_PET_PROFILE_IMAGES}
                      handleUploadUrl="/api/profile-image/upload"
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
                <FormLabel>Name</FormLabel>
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
              <FormItem className="space-y-2 py-1">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    className="flex flex-row items-center gap-3"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cat" />
                      </FormControl>
                      <FormLabel className="font-normal">Cat</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="small_dog" />
                      </FormControl>
                      <FormLabel className="font-normal">Small Dog</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="big_dog" />
                      </FormControl>
                      <FormLabel className="font-normal">Big Dog</FormLabel>
                    </FormItem>
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
              <FormItem className="space-y-2 py-1">
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                    className="flex flex-row items-center gap-3"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
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

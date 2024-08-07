"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Center } from "@petzo/db";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@petzo/ui/components/form";
import { ImageInput } from "@petzo/ui/components/image-input";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import { Textarea } from "@petzo/ui/components/textarea";
import { toast } from "@petzo/ui/components/toast";
import { centerApp } from "@petzo/validators";

import { DEFAULT_MAX_SERVICE_IMAGES } from "~/lib/constants";
import { api } from "~/trpc/react";
import FormSaveButton from "./form-save-button";

type CenterSchema = z.infer<typeof centerApp.center.CenterSchema>;

export function CenterForm({ center }: { center?: Center }) {
  const router = useRouter();

  const form = useForm({
    schema: centerApp.center.CenterSchema,
    defaultValues: {
      publicId: center?.publicId,
      name: center?.name,
      description: center?.description ?? "",
      images: center?.images ?? [],
      phoneNumber: center?.phoneNumber ?? "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCenter = api.center.createCenter.useMutation();
  const updateCenter = api.center.updateCenter.useMutation();

  const onMutateSuccess = (
    data?: Center | null,
    message = "Center added successfully!",
  ) => {
    if (!data) {
      toast.error(
        "There was an error updating the data. We are looking into it!",
      );
      return;
    }

    toast.success(message);
    if (!center?.centerAddressId) {
      router.push(`/dashboard/${data.publicId}/address/create?onboarding=true`);
    } else {
      router.push(`/dashboard/${data.publicId}`);
    }
    router.refresh();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: unknown) => {
    const data = values as CenterSchema;

    setIsSubmitting(true);

    if (center) {
      await updateCenter.mutateAsync(data, {
        onSuccess: (data) => {
          onMutateSuccess(data, "Center updated successfully!");
        },
      });
    } else {
      await createCenter.mutateAsync(data, {
        onSuccess: (data) => {
          onMutateSuccess(data, "Center created successfully!");
        },
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 pb-16"
      >
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl font-semibold">
            {center ? `Edit ` : "Tell us about your "}
            <span className="font-semibold text-foreground">Center</span>
          </h1>
        </div>

        <div className="space-y-5">
          <BasicDetails form={form} />
          <hr className="!mt-7 border" />
          <MediaInformation form={form} />
        </div>

        <FormSaveButton
          disabled={Object.keys(form.formState.dirtyFields).length == 0}
          isSubmitting={isSubmitting}
          name={center?.centerAddressId ? "Save" : "Save & Continue"}
          label={center?.centerAddressId ? "" : "Next: Add Address"}
        />
      </form>
    </Form>
  );
}

const MediaInformation = ({ form }: { form: UseFormReturn<CenterSchema> }) => {
  return (
    <div className="space-y-2">
      <Label className="text-center text-lg font-bold">Media</Label>
      {/* Images */}
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <div>
              <FormLabel>
                Images{" "}
                <span className="!font-normal">
                  (max {DEFAULT_MAX_SERVICE_IMAGES} images)
                </span>
              </FormLabel>
              <FormDescription>
                Recommended Size: 500 x 500 px or 1:1 ratio
              </FormDescription>
            </div>
            <div className="flex items-center gap-2">
              <FormControl>
                <ImageInput
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  objectFit="cover"
                  clearErrors={form.clearErrors}
                  setError={form.setError}
                  ratio={1}
                  maxFiles={DEFAULT_MAX_SERVICE_IMAGES}
                  handleUploadUrl="/api/upload-image"
                  basePathname="images/centers"
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const BasicDetails = ({ form }: { form: UseFormReturn<CenterSchema> }) => {
  return (
    <div className="space-y-2">
      <Label className="text-lg font-bold">Basic Details</Label>

      <div className="space-y-5">
        {/* Center Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter center name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Name */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-28 w-full md:min-h-36"
                  placeholder={"Tell the world about center."}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  className="placeholder:text-secondary-foreground/40"
                  placeholder="Phone Number - 10 digits eg. (9999999999)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

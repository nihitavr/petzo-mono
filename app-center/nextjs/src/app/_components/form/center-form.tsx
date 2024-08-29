"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import type { DAYS_TYPE } from "@petzo/constants";
import type { Center } from "@petzo/db";
import {
  CENTER_CTA_BUTTONS,
  CENTER_CTA_BUTTONS_CONFIG,
  CENTER_FEATURES,
  CENTER_FEATURES_CONFIG,
  DAYS,
  DAYS_CONFIG,
} from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@petzo/ui/components/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@petzo/ui/components/popover";
import { Textarea } from "@petzo/ui/components/textarea";
import { toast } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";
import { timeUtils } from "@petzo/utils";
import { centerApp } from "@petzo/validators";

import { DEFAULT_MAX_SERVICE_IMAGES } from "~/lib/constants";
import { api } from "~/trpc/react";
import FormSaveButton from "./form-save-button";

type CenterSchema = z.infer<typeof centerApp.center.CenterSchema>;

export function CenterForm({
  center,
  isAdmin,
}: {
  center?: Center;
  isAdmin?: boolean;
}) {
  const router = useRouter();

  const operatingHour = center?.operatingHours
    ? Object.values(center?.operatingHours).find((val) => !!val)
    : ({} as { startTime: string; endTime: string });

  const form = useForm({
    schema: centerApp.center.CenterSchema,
    defaultValues: {
      publicId: center?.publicId,
      name: center?.name,
      description: center?.description ?? "",
      operatingHours: center?.operatingHours ?? {
        sun: null,
        mon: null,
        tue: null,
        wed: null,
        thu: null,
        fri: null,
        sat: null,
      },
      images: center?.images ?? [],
      googleRating: center?.googleRating ?? 0,
      googleRatingCount: center?.googleRatingCount ?? 0,
      phoneNumber: center?.phoneNumber ?? "",
      features: center?.features ?? [],
      ctaButtons: center?.ctaButtons ?? [],
      startTime: operatingHour?.startTime,
      endTime: operatingHour?.endTime,
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
      router.push(`/dashboard/${data.publicId}/manage`);
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
          <TimingInformation form={form} />
          <hr className="!mt-7 border" />
          <MediaInformation form={form} />
          {isAdmin && (
            <>
              <hr className="!mt-7 border" />
              <GoogleInformation form={form} />
            </>
          )}
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
              <FormLabel>Center Name*</FormLabel>
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
                  className="min-h-36 w-full md:min-h-56"
                  placeholder={"Tell the world about center"}
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
              <FormLabel>Phone Number*</FormLabel>
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

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Features</FormLabel>
                <FormDescription>
                  Does your center offer any of the following?
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex flex-wrap items-center gap-2">
                  {CENTER_FEATURES.map((feature) => {
                    const includesFeature = field.value?.includes(feature);
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          let value = field.value;

                          if (includesFeature) {
                            value = value.filter((v) => v !== feature);
                          } else {
                            value = [...value, feature];
                          }

                          field.onChange([...value]);
                        }}
                        key={`day-${feature}`}
                        className={`rounded-md border px-2 py-1 text-sm ${includesFeature ? "bg-primary/30" : ""}`}
                      >
                        <div className="flex items-center gap-1">
                          <Image
                            width={18}
                            height={18}
                            src={CENTER_FEATURES_CONFIG[feature].icon}
                            alt={CENTER_FEATURES_CONFIG[feature].name}
                          />
                          <span>{CENTER_FEATURES_CONFIG[feature].name} </span>
                          {includesFeature ? (
                            <span className="font-bold">✓</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ctaButtons"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Cta Buttons</FormLabel>
                <FormDescription>
                  Which buttons would you like to show on your center page?
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex flex-wrap items-center gap-2">
                  {CENTER_CTA_BUTTONS.map((feature) => {
                    const includesFeature = field.value?.includes(feature);
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          let value = field.value;

                          if (includesFeature) {
                            value = value.filter((v) => v !== feature);
                          } else {
                            value = [...value, feature];
                          }

                          field.onChange([...value]);
                        }}
                        key={`day-${feature}`}
                        className={`rounded-md border px-2 py-1 text-sm ${includesFeature ? "bg-primary/30" : ""}`}
                      >
                        <div className="flex items-center gap-1">
                          <span>
                            {CENTER_CTA_BUTTONS_CONFIG[feature].name}{" "}
                          </span>
                          {includesFeature ? (
                            <span className="font-bold">✓</span>
                          ) : (
                            ""
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

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

const TimingInformation = ({ form }: { form: UseFormReturn<CenterSchema> }) => {
  return (
    <div className="space-y-2">
      <Label className="text-lg font-bold">Timing Details</Label>

      <div className="space-y-5">
        <FormField
          control={form.control}
          name="operatingHours"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Days</FormLabel>
                <FormDescription>
                  Select the days the service is available
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex flex-wrap items-center gap-2">
                  {DAYS.map((day) => {
                    const dayObj = field.value?.[day];

                    return (
                      <button
                        type="button"
                        onClick={() => {
                          const operatingHours = field.value;

                          if (operatingHours[day]) {
                            operatingHours[day] = null;
                          } else {
                            operatingHours[day] = {
                              startTime: form.getValues().startTime,
                              endTime: form.getValues().endTime,
                            };
                          }

                          field.onChange({ ...operatingHours });
                        }}
                        key={`day-${day}`}
                        className={`rounded-md border px-2 py-1 text-sm ${dayObj ? "bg-primary/30" : ""}`}
                      >
                        {DAYS_CONFIG[day]}{" "}
                        {dayObj ? <span className="font-bold">✓</span> : ""}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-7">
          <TimeFormField
            form={form}
            name="startTime"
            label="Opening Time"
            description="This is the opening time of the center."
          />
          <TimeFormField
            form={form}
            name="endTime"
            label="Closing Time"
            description="This is the closing time of the center."
            timeStart={form.watch("startTime")}
          />
        </div>
      </div>
    </div>
  );
};

const GoogleInformation = ({ form }: { form: UseFormReturn<CenterSchema> }) => {
  return (
    <div className="space-y-2 rounded-xl border border-red-500 p-3">
      <Label className="text-center text-lg font-bold">
        Google Information (Only Admins)
      </Label>
      {/* Images */}
      <FormField
        control={form.control}
        name="googleRating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Google Rating</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Google Rating" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="googleRatingCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Google Rating Count</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Google Rating Count"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const TimeFormField = ({
  form,
  name,
  label,
  description,
  timeStart,
}: {
  form: UseFormReturn<CenterSchema>;
  name: "startTime" | "endTime";
  label: string;
  description?: string;
  timeStart?: string;
}) => {
  const timesHHMM = useMemo(() => {
    return timeUtils.generateTimesForDayHHMM();
  }, []);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div>
            <FormLabel className="pointer-events-none">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? timeUtils.convertTime24To12(
                        timesHHMM.find((time24h) => time24h === field.value),
                      )
                    : "Select Time"}
                  <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {timesHHMM.map((time24h) => {
                      const time12h = timeUtils.convertTime24To12(time24h);
                      const isBefore = timeStart
                        ? timeUtils.isTimeBeforeOrEqual(time24h, timeStart)
                        : false;

                      if (isBefore) return null;

                      return (
                        <CommandItem
                          value={time24h}
                          key={time24h}
                          onSelect={() => {
                            const operatingHours =
                              form.getValues().operatingHours;
                            Object.keys(operatingHours).forEach((key) => {
                              const day = key as DAYS_TYPE;
                              if (operatingHours[day]) {
                                operatingHours[day]![name] = time24h;
                              }
                            });
                            form.setValue("operatingHours", {
                              ...operatingHours,
                            });
                            field.onChange(time24h);
                          }}
                          className={cn(
                            "cursor-pointer",
                            isBefore ? "opacity-100" : "",
                          )}
                        >
                          <LuCheck
                            className={cn(
                              "h-4 w-4",
                              time24h === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="w-full text-end">{time12h}</span>
                          <div className="h-1 w-4" />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

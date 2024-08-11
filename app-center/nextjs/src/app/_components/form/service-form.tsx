"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import type { DAYS_TYPE } from "@petzo/constants";
import type { Service } from "@petzo/db";
import {
  DAYS,
  DAYS_CONFIG,
  PET_TYPE,
  PET_TYPE_CONFIG,
  SERVICES_CONFIG,
} from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import { Checkbox } from "@petzo/ui/components/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@petzo/ui/components/select";
import { Textarea } from "@petzo/ui/components/textarea";
import { toast } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";
import { timeUtils } from "@petzo/utils";
import { centerApp } from "@petzo/validators";

import { DEFAULT_MAX_SERVICE_IMAGES } from "~/lib/constants";
import { api } from "~/trpc/react";
import FormSaveButton from "../../_components/form/form-save-button";

type ServiceSchema = z.infer<typeof centerApp.service.ServiceSchema>;

export function ServiceForm({
  centerPublicId,
  service,
}: {
  centerPublicId: string;
  service?: Service;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding");

  const form = useForm({
    schema: centerApp.service.ServiceSchema,
    defaultValues: {
      centerPublicId: centerPublicId,
      publicId: service?.publicId,
      name: service?.name,
      description: service?.description ?? "",
      images: service?.images ?? [],
      serviceType: service?.serviceType,
      petTypes: service?.petTypes ?? Array.from(PET_TYPE),
      price: service?.price,
      duration: service?.duration,

      config: service?.config ?? {
        operatingHours: {
          sun: null,
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
        },
      },
      startTime: service?.startTime,
      startTimeEnd: service?.startTimeEnd,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const createService = api.service.createService.useMutation();
  const updateService = api.service.updateService.useMutation();

  const onMutateSuccess = (
    data?: Service | null,
    message = "Service added successfully!",
  ) => {
    if (!data) {
      toast.error(
        "There was an error updating the data. We are looking into it!",
      );
      return;
    }

    toast.success(message);

    if (isOnboarding) {
      router.push(`/dashboard/${centerPublicId}/services?onboarding=true`);
    } else {
      router.push(`/dashboard/${centerPublicId}/services`);
    }

    router.refresh();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: unknown) => {
    const data = values as ServiceSchema;

    setIsSubmitting(true);

    if (service) {
      await updateService.mutateAsync(data, {
        onSuccess: (data) => {
          onMutateSuccess(data, "Service updated successfully!");
        },
      });
    } else {
      await createService.mutateAsync(data, {
        onSuccess: (data) => {
          onMutateSuccess(data, "Service created successfully!");
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
          <h1 className="text-xl font-medium">
            {service ? `Edit ` : "Tell us about your "}
            <span className="font-semibold text-foreground">
              {service ? `${form.getValues()?.name}` : `Service!`}
            </span>
          </h1>
        </div>

        <div className="space-y-5">
          <BasicDetails form={form} />
          <hr className="!mt-7 border" />
          <PetInformation form={form} />
          <hr className="!mt-7 border" />
          <TimingInformation form={form} />
          <hr className="!mt-7 border" />
          <MediaInformation form={form} />
        </div>

        <FormSaveButton
          disabled={Object.keys(form.formState.dirtyFields).length == 0}
          isSubmitting={isSubmitting}
          name="Save & Continue"
          label="Next: Update Service Config"
        />
      </form>
    </Form>
  );
}

const BasicDetails = ({ form }: { form: UseFormReturn<ServiceSchema> }) => {
  return (
    <div className="space-y-2">
      <Label className="text-lg font-bold">Basic Details</Label>

      <div className="space-y-5">
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type*</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(SERVICES_CONFIG).map(([key, value]) => {
                    return (
                      <SelectItem
                        key={`service-${key}`}
                        value={value.publicId}
                        className="cursor-pointer"
                      >
                        <div className="flex !flex-row items-center gap-2">
                          {value.icon && (
                            <Image
                              src={value.icon}
                              height={20}
                              width={20}
                              alt=""
                            />
                          )}
                          <span>{value.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name*</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (In rupees)*</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Price" {...field} />
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
                  placeholder={"Details about this service."}
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

const TimingInformation = ({
  form,
}: {
  form: UseFormReturn<ServiceSchema>;
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-lg font-bold">Timing Details</Label>

      <div className="space-y-5">
        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Duration*</FormLabel>
                <FormDescription>
                  Duration of the service in minutes.
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input type="number" placeholder="Minutes" {...field} />
                  <span className="font-semibold">minutes</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="config"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Days*</FormLabel>
                <FormDescription>
                  Select the days the service is available
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex flex-wrap items-center gap-2">
                  {DAYS.map((day) => {
                    const dayObj = field.value?.operatingHours[day];

                    return (
                      <button
                        type="button"
                        onClick={() => {
                          const config = field.value;

                          if (config.operatingHours[day]) {
                            config.operatingHours[day] = null;
                          } else {
                            config.operatingHours[day] = {
                              startTime: form.getValues().startTime,
                              startTimeEnd: form.getValues().startTimeEnd,
                            };
                          }

                          field.onChange({ ...config });
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
            label="First Slot Time*"
            description="This is the first slot time for the service."
          />
          <TimeFormField
            form={form}
            name="startTimeEnd"
            label="Last Slot Time*"
            description="This is the last slot time for the service."
          />
        </div>
      </div>
    </div>
  );
};

const TimeFormField = ({
  form,
  name,
  label,
  description,
}: {
  form: UseFormReturn<ServiceSchema>;
  name: "startTime" | "startTimeEnd";
  label: string;
  description?: string;
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
                      return (
                        <CommandItem
                          value={time24h}
                          key={time24h}
                          onSelect={() => {
                            const config = form.getValues().config;
                            Object.keys(config.operatingHours).forEach(
                              (key) => {
                                const day = key as DAYS_TYPE;
                                if (config.operatingHours[day]) {
                                  config.operatingHours[day]![name] = time24h;
                                }
                              },
                            );
                            form.setValue("config", { ...config });
                            field.onChange(time24h);
                          }}
                          className="cursor-pointer"
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

const PetInformation = ({ form }: { form: UseFormReturn<ServiceSchema> }) => {
  return (
    <div className="space-y-2">
      <Label className="text-lg font-bold">Pet Information</Label>
      {/* Pet Types */}
      <FormField
        control={form.control}
        name="petTypes"
        render={() => (
          <FormItem>
            <div>
              <FormLabel>Pet Types*</FormLabel>
              <FormDescription>
                Select the type of pets this service is for.
              </FormDescription>
            </div>
            <div className="flex gap-6">
              {Object.entries(PET_TYPE_CONFIG).map(([petType, label]) => (
                <FormField
                  key={petType}
                  control={form.control}
                  name="petTypes"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={petType}
                        className="flex cursor-pointer flex-row items-center space-x-1 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(petType)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value!, petType])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== petType,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">
                          {label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const MediaInformation = ({ form }: { form: UseFormReturn<ServiceSchema> }) => {
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
                  basePathname="images/services"
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

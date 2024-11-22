"use client";

import type { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { format, parse } from "date-fns";
import { HiOutlineMoon } from "react-icons/hi";
import { WiDaySunny, WiSunrise } from "react-icons/wi";

import type { Center, CustomerUser, Pet, Service, Slot } from "@petzo/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@petzo/ui/components/accordion";
import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";
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
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import Loader from "@petzo/ui/components/loader";
import { RadioGroup, RadioGroupItem } from "@petzo/ui/components/radio-group";
import { Skeleton } from "@petzo/ui/components/skeleton";
import { toast } from "@petzo/ui/components/toast";
import { cn, iOS } from "@petzo/ui/lib/utils";
import { centerUtils, timeUtils } from "@petzo/utils";
import {
  convertTime24To12,
  isAfternoon,
  isEvening,
  isMorning,
} from "@petzo/utils/time";
import { petValidator } from "@petzo/validators";

import SignIn from "~/app/_components/sign-in";
import { useMediaQuery } from "~/lib/hooks/screen.hooks";
import {
  addItemToServicesCart,
  servicesCart,
} from "~/lib/storage/service-cart-storage";
import { api } from "~/trpc/react";
import { trackCustom } from "~/web-analytics/react";

type PetProfileSchema = z.infer<typeof petValidator.ProfileSchema>;

export function BookServiceDialog({
  defaultopen = false,
  service,
  center,
  user,
}: {
  defaultopen?: boolean;
  center: Center;
  service: Service;
  user?: CustomerUser;
}) {
  const serviceUrl = useMemo(
    () => centerUtils.getServiceBookingUrl(service, center),
    [],
  );
  const centerUrl = useMemo(() => centerUtils.getCenterUrl(center), []);

  const pathname = usePathname();

  const [open, setOpen] = useState(defaultopen);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onOpenChange = (open: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!open && pathname == serviceUrl) window.history.back();

    setOpen(open);
  };

  useEffect(() => {
    if (pathname == serviceUrl) setOpen(true);
  }, [pathname]);

  useEffect(() => {
    const handleBackButton = () => {
      if (open) setOpen(false);
    };

    if (pathname == serviceUrl) window.history.replaceState({}, "", centerUrl);

    if (open) {
      window.history.pushState({}, "", serviceUrl);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [open, center?.id, service?.id]);

  const serviceImage = service.images?.[0]?.url;

  const onTriggerClick = () => {
    trackCustom("click_add_service_booking", {
      servicePublicId: service.publicId,
    });
  };

  if (isDesktop || iOS()) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger onClick={onTriggerClick} asChild>
          <Button variant="primary">Add</Button>
        </DialogTrigger>
        <DialogContent className="flex h-[80vh] flex-col justify-start rounded-xl p-3 pb-16 sm:max-w-[425px]">
          <DialogHeader>
            <span className="text-xs">Booking</span>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{service.name}</DialogTitle>
                <span className="-mt-1 text-sm font-semibold text-primary">
                  at {center.name}
                </span>
              </div>
              {serviceImage && (
                <div className="relative aspect-square h-full overflow-hidden rounded-md border">
                  <Image
                    src={serviceImage}
                    fill
                    className="object-cover"
                    alt=""
                  />
                </div>
              )}
            </div>
          </DialogHeader>
          <ServiceBookingForm
            service={service}
            center={center}
            user={user}
            onOpenChange={onOpenChange}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger onClick={onTriggerClick} asChild>
        <Button variant="primary">Add</Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] rounded-t-3xl pb-16">
        <DrawerHeader className="text-left">
          <span className="text-xs">Booking</span>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <DrawerTitle className="text-base leading-none">
                {service.name}
              </DrawerTitle>
              <span className="line-clamp-1 text-sm font-semibold text-primary">
                at {center.name}
              </span>
            </div>
            {serviceImage && (
              <div className="relative aspect-square h-full overflow-hidden rounded-md border">
                <Image
                  src={serviceImage}
                  fill
                  className="object-cover"
                  alt=""
                />
              </div>
            )}
          </div>
        </DrawerHeader>
        <ServiceBookingForm
          service={service}
          center={center}
          user={user}
          className="px-4"
          onOpenChange={onOpenChange}
        />
      </DrawerContent>
    </Drawer>
  );
}

function ServiceBookingForm({
  className,
  service,
  center,
  user,
  onOpenChange,
}: React.ComponentProps<"form"> & {
  service: Service;
  center: Center;
  user?: CustomerUser;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const [isAddNewPet, setIsAddNewPet] = useState(false);
  const [accordianValue, setAccordianValue] = useState(
    "slot-starttime-selection",
  );

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return format(date, "yyyy-MM-dd");
  }, []);

  const [selectedSlotDate, setSelectedSlotDate] = useState<string>(tomorrow);

  const petForm = useForm({
    schema: petValidator.ProfileSchema,
    defaultValues: {
      name: "",
      type: undefined,
      breed: "",
    },
  });

  const {
    data: pets,
    isLoading: isPetsLoading,
    refetch: refetchPets,
  } = api.pet.getPetProfiles.useQuery(undefined, {
    enabled: !!user,
  });

  const [isNewPetSubmitting, setIsNewPetSubmitting] = useState(false);
  const addPet = api.pet.addPetProfile.useMutation();

  const { data: slots, isLoading: isSlotsLoading } =
    api.slot.getDateToSlotsMap.useQuery({ serviceId: service.id });

  const addToCart = (closeDialog = true) => {
    if (!selectedPet || !selectedSlot) return;

    addItemToServicesCart({
      center: center,
      items: [
        {
          service: service,
          slot: selectedSlot,
          pet: selectedPet,
        },
      ],
    });

    if (closeDialog) onOpenChange(false);
  };

  useEffect(() => {
    const firstDate = slots?.keys().next().value as string;
    if (!slots || !firstDate) return;
    setSelectedSlotDate(firstDate);
  }, [slots]);

  // Time Slot click handler.
  const onSlotClick = (slot: Slot) => {
    if (!slot.availableSlots) return;

    setSelectedSlot(slot);
    setTimeout(() => {
      setAccordianValue(selectedPet ? "" : "pet-details");
    }, 200);
  };

  // Save new pet flow submit button.
  const onSubmitSaveNewPet = async (values: unknown) => {
    trackCustom("click_save_new_pet", {
      servicePublicId: service.publicId,
    });

    const data = values as PetProfileSchema;

    setIsNewPetSubmitting(true);

    await addPet.mutateAsync(data, {
      onSuccess: (data?: Pet | null) => {
        if (!data) {
          toast.error(
            "There was an error updating the data. We are looking into it!",
          );
          return;
        }
        setAccordianValue(selectedSlot ? "" : "slot-starttime-selection");
        setSelectedPet(data);
        setIsAddNewPet(false);
      },
      onError: () => {
        toast.error(
          "There was an error updating the data. We are looking into it!",
        );
      },
    });

    await refetchPets();

    setIsNewPetSubmitting(false);
  };

  // Map of unavailable time periods. This is required to
  // remove the slots that are already added to cart.
  const unavailableTimePeriodMap = useMemo(() => {
    return servicesCart.value.items
      ?.map((item) => {
        return {
          date: item.slot.date,
          surroundingTimes: timeUtils.getSurroundingTime(
            item.slot.startTime,
            item.service.duration,
          ),
        };
      })
      ?.reduce(
        (acc, val) => {
          val.surroundingTimes.forEach((time) => {
            const key = `${val.date}_${time}`;
            if (acc[key] === undefined) acc[key] = 1;
            else acc[key]++;
          });
          return acc;
        },
        {} as Record<string, number>,
      );
  }, [servicesCart.value.items?.length]);

  // Check if the slot is available using the above unavailableTimePeriodMap
  //  function and the given time slot.
  const isSlotAvailable = (slot: Slot) => {
    return (
      slot.availableSlots -
        (unavailableTimePeriodMap?.[`${slot.date}_${slot.startTime}`] ?? 0) >
      0
    );
  };

  if (isPetsLoading || isSlotsLoading) {
    return (
      <div
        className={cn("flex flex-col gap-2 px-3 md:px-0", iOS() ? "px-0" : "")}
      >
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className={cn("grid items-start gap-4 overflow-y-auto", className)}>
      <Accordion
        type="single"
        value={accordianValue}
        onValueChange={setAccordianValue}
        collapsible={true}
        className="space-y-1"
      >
        {/* Start Time */}
        <AccordionItem
          value="slot-starttime-selection"
          className="rounded-lg border"
        >
          <AccordianPreview
            label="Start Time"
            labelValue={
              selectedSlot
                ? format(
                    parse(
                      selectedSlot.startTime,
                      "HH:mm:ss",
                      new Date(selectedSlot.date),
                    ),
                    "EEE do MMM, h:mm a",
                  )
                : ""
            }
            selectedAccordianValue={accordianValue}
            accordianValue="slot-starttime-selection"
            notSelectedText="Not Selected"
          />

          <AccordionContent
            data-vaul-no-drag
            className="max-h-54 grid grid-cols-1 border-t py-3"
          >
            <div className="no-scrollbar overflow-x-auto px-3 pb-3">
              <div className="flex w-max items-center gap-2">
                {slots &&
                  Array.from(slots.entries()).map(([date, dateSlots], idx) => {
                    const availableSlots = dateSlots.filter(isSlotAvailable);

                    return (
                      <div
                        onClick={() => setSelectedSlotDate(date)}
                        aria-hidden="true"
                        className={`flex flex-shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-md border px-2 py-1 text-xs ${selectedSlotDate == date ? "bg-primary/30" : "hover:bg-primary/10"}`}
                        key={idx}
                      >
                        <span className="font-semibold">
                          {format(date, "EEE, d MMM")}
                        </span>
                        <span
                          className={`font-medium ${availableSlots.length ? "text-green-700" : "text-red-700"}`}
                        >
                          {availableSlots.length} available
                        </span>
                      </div>
                    );
                  })}
                {/* <div>This is slot content</div> */}
              </div>
            </div>

            <div className="max-h-72 overflow-y-scroll">
              {(() => {
                const morningSlots = slots
                  ?.get(selectedSlotDate)
                  ?.filter((slot) => isMorning(slot.startTime));

                const afternoonSlots = slots
                  ?.get(selectedSlotDate)
                  ?.filter((slot) => isAfternoon(slot.startTime));

                const eveningSlots = slots
                  ?.get(selectedSlotDate)
                  ?.filter((slot) => isEvening(slot.startTime));

                return (
                  <div className="flex flex-col">
                    {morningSlots?.length && (
                      <SlotSection
                        icon={
                          <WiSunrise
                            strokeWidth={0.3}
                            className="size-6 text-yellow-600"
                          />
                        }
                        name="Morning"
                        slots={morningSlots}
                        selectedSlotId={selectedSlot?.id}
                        isSlotAvailable={isSlotAvailable}
                        onSlotClick={onSlotClick}
                      />
                    )}

                    {afternoonSlots?.length && (
                      <SlotSection
                        icon={
                          <WiDaySunny
                            strokeWidth={0.3}
                            className="size-6 text-orange-600"
                          />
                        }
                        name="Afternoon"
                        slots={afternoonSlots}
                        selectedSlotId={selectedSlot?.id}
                        isSlotAvailable={isSlotAvailable}
                        onSlotClick={onSlotClick}
                      />
                    )}

                    {eveningSlots?.length && (
                      <SlotSection
                        icon={
                          <div className="flex size-6 items-center justify-center">
                            <HiOutlineMoon
                              strokeWidth={2.2}
                              className="size-4 text-slate-500"
                            />
                          </div>
                        }
                        name="Evening"
                        slots={eveningSlots}
                        selectedSlotId={selectedSlot?.id}
                        isSlotAvailable={isSlotAvailable}
                        onSlotClick={onSlotClick}
                      />
                    )}
                  </div>
                );
              })()}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Booking For */}
        <AccordionItem value="pet-details" className="rounded-lg border">
          <AccordianPreview
            label="Booking For"
            labelValue={selectedPet?.name}
            selectedAccordianValue={accordianValue}
            accordianValue="pet-details"
            notSelectedText="Not Selected"
          />

          <AccordionContent className="border-t px-2 pt-3">
            {user ? (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground/80">
                    {!pets?.length || isAddNewPet
                      ? "Add New Pet*"
                      : "Select Pet*"}
                  </Label>
                  {!!pets?.length && (
                    <>
                      <span>OR</span>
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedPet(null);
                          setIsAddNewPet((isAddNewPet) => !isAddNewPet);
                        }}
                        variant={pets?.length ? "secondary" : "primary"}
                        size="sm"
                        className="h-6"
                      >
                        {isAddNewPet ? "Select Existing Pet" : "Add New Pet"}
                      </Button>
                    </>
                  )}
                </div>
                {!isAddNewPet && pets?.length ? (
                  <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
                    {pets?.length ? (
                      pets.map((pet, idx) => (
                        <div
                          key={idx}
                          className={`flex cursor-pointer flex-col gap-1 rounded-lg p-2 ${pet.publicId == selectedPet?.publicId ? "border bg-primary/30" : "hover:bg-primary/10"}`}
                          onClick={() => {
                            setTimeout(() => {
                              setAccordianValue(
                                selectedSlot ? "" : "slot-starttime-selection",
                              );
                            }, 200);
                            setSelectedPet(pet);
                          }}
                          aria-hidden="true"
                        >
                          <div className="relative size-12 overflow-hidden rounded-full bg-foreground/50">
                            <Image
                              src={
                                pet.images?.[0]?.url
                                  ? pet.images?.[0]?.url
                                  : pet.type !== "cat"
                                    ? "/dog-avatar.jpeg"
                                    : "/cat-avatar.jpeg"
                              }
                              fill
                              className="object-cover"
                              alt=""
                            />
                          </div>
                          <span className="w-full text-center text-sm font-semibold">
                            {pet.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="w-full text-center text-sm">
                        No pets found!
                        <br /> Click{" "}
                        <span className="font-semibold">Add New Pet</span> to
                        create a new pet.
                      </div>
                    )}
                  </div>
                ) : (
                  <Form {...petForm}>
                    <form
                      onSubmit={petForm.handleSubmit(onSubmitSaveNewPet)}
                      className="flex flex-col gap-3"
                    >
                      {/* Pet Name */}
                      <FormField
                        control={petForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-2sm">
                              Pet Name*
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Pet Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* Pet Type */}
                      <FormField
                        control={petForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-0 py-1">
                            <FormLabel className="text-2sm">Type*</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value ?? ""}
                                className="flex flex-row items-center gap-2"
                              >
                                <FormItem>
                                  <FormControl>
                                    <RadioGroupItem
                                      value="cat"
                                      className="peer hidden"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className={`flex h-8 cursor-pointer items-center gap-1 rounded-md border p-2 text-2sm font-normal ${field.value == "cat" ? "bg-primary/30" : "hover:bg-primary/10"}`}
                                  >
                                    <span className="whitespace-nowrap">
                                      Cat
                                    </span>
                                    <Cat />
                                  </FormLabel>
                                </FormItem>
                                <FormItem>
                                  <FormControl>
                                    <RadioGroupItem
                                      value="small_dog"
                                      className="peer hidden"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className={`flex h-8 cursor-pointer items-center gap-1 rounded-md border p-2 text-2sm font-normal ${field.value == "small_dog" ? "bg-primary/30" : "hover:bg-primary/10"}`}
                                  >
                                    <span className="whitespace-nowrap">
                                      Small Dog
                                    </span>{" "}
                                    <SmallDog />
                                  </FormLabel>
                                </FormItem>
                                <FormItem>
                                  <FormControl>
                                    <RadioGroupItem
                                      value="big_dog"
                                      className="peer hidden"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className={`flex h-8 cursor-pointer items-center gap-1 rounded-md border p-2 text-2sm font-normal ${field.value == "big_dog" ? "bg-primary/30" : "hover:bg-primary/10"}`}
                                  >
                                    {" "}
                                    <span className="whitespace-nowrap">
                                      Big Dog
                                    </span>{" "}
                                    <BigDog />
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={petForm.control}
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

                      <div className="mt-3 flex justify-center md:justify-end">
                        <Button
                          className="flex w-full items-center justify-center gap-2 md:w-52"
                          type="submit"
                          disabled={
                            isNewPetSubmitting || !petForm.formState.isValid
                          }
                        >
                          <span>Save</span>
                          <div>
                            <Loader
                              className="h-5 w-5 border-2"
                              show={isNewPetSubmitting}
                            />
                          </div>
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="text-center">
                  We need log in to <span className="font-semibold">save</span>{" "}
                  your{" "}
                  <span className="font-semibold">pet&apos;s information.</span>
                </span>
                <SignIn
                  onClick={() => {
                    trackCustom("click_login_service_booking");
                  }}
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        <div className="fixed bottom-0 left-0 flex w-full space-x-2 px-3 py-3 pt-2">
          <Button
            type="button"
            onClick={() => {
              trackCustom("click_add_to_cart_service_booking", {
                servicePublicId: service.publicId,
                slotId: selectedSlot!.id,
                petId: selectedPet!.id,
              });
              addToCart();
            }}
            variant="outline"
            className="w-1/2"
            disabled={!selectedPet || !selectedSlot}
          >
            Add to Cart
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-1/2"
            disabled={!selectedPet || !selectedSlot}
            onClick={() => {
              addToCart(false);
              router.push(`/checkout/services`);
            }}
          >
            Checkout
          </Button>
        </div>
      </Accordion>
    </div>
  );
}

const SlotSection = ({
  icon,
  name,
  slots,
  selectedSlotId,
  isSlotAvailable,
  onSlotClick,
}: {
  icon: React.ReactNode;
  name: string;
  slots: Slot[];
  selectedSlotId?: number | null;
  isSlotAvailable: (slot: Slot) => boolean;
  onSlotClick: (slot: Slot) => void;
}) => {
  const areAllSlotsUnavailable = slots.every((slot) => !slot.availableSlots);

  return (
    <div className="space-y-2 p-3">
      <div className="flex items-center gap-0.5 font-semibold">
        {icon}
        <span>{name}</span>
      </div>
      {!areAllSlotsUnavailable ? (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot, idx) => (
            <SlotBox
              key={idx}
              onClick={() => onSlotClick(slot)}
              isAvailable={isSlotAvailable(slot)}
              isSelected={selectedSlotId == slot.id}
              slotStartTime={slot.startTime}
            />
          ))}
        </div>
      ) : (
        <span className="w-full text-center text-destructive">
          No slots available!
        </span>
      )}
    </div>
  );
};

const SlotBox = ({
  onClick,
  isAvailable,
  isSelected,
  slotStartTime,
}: {
  onClick: () => void;
  isAvailable: boolean;
  isSelected: boolean;
  slotStartTime: string;
}) => {
  return (
    <span
      onClick={onClick}
      aria-hidden="true"
      className={`cursor-pointer rounded-md border p-1.5 text-xs font-semibold ${!isAvailable ? "bg-muted opacity-60" : isSelected ? "bg-primary/30" : "hover:bg-primary/10"}`}
    >
      {convertTime24To12(slotStartTime)}
    </span>
  );
};

const AccordianPreview = ({
  label,
  labelValue,
  accordianValue,
  selectedAccordianValue,
  notSelectedText,
}: {
  label: string;
  labelValue?: string;
  accordianValue: string;
  selectedAccordianValue?: string;
  notSelectedText: string;
}) => {
  return (
    <div
      className={`flex w-full items-center justify-between px-2 ${selectedAccordianValue == accordianValue ? "rounded-t-lg bg-primary/10" : ""}`}
    >
      <span className="text-sm font-semibold">
        {label}:{" "}
        {labelValue ? (
          <span className="whitespace-nowrap text-primary">{labelValue}</span>
        ) : (
          <span className="text-destructive">{notSelectedText}</span>
        )}
      </span>
      <div className="w-min">
        <AccordionTrigger className="w-min py-2" noIcon>
          <span className="inline-flex h-6 items-center justify-center whitespace-nowrap rounded-full border border-input bg-background px-3 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            {selectedAccordianValue == accordianValue ? "Close" : "Edit"}
          </span>
        </AccordionTrigger>
      </div>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { format, parse } from "date-fns";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { HiOutlineMoon } from "react-icons/hi";
import { LuX } from "react-icons/lu";
import { WiDaySunny, WiSunrise } from "react-icons/wi";

import type {
  Center,
  CustomerAddresses,
  CustomerUser,
  Pet,
  Service,
  Slot,
} from "@petzo/db";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import { Skeleton } from "@petzo/ui/components/skeleton";
import { cn } from "@petzo/ui/lib/utils";
import {
  convertTime24To12,
  isAfternoon,
  isEvening,
  isMorning,
} from "@petzo/utils/time";

import SignIn from "~/app/_components/sign-in";
import { useMediaQuery } from "~/lib/hooks/screen.hooks";
import {
  getCenterRelativeUrl,
  getServiceBookingRelativeUrl,
} from "~/lib/utils/center.utils";
import { api } from "~/trpc/react";
import NewAddessModal from "./add-address-modal";

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
  const pathname = usePathname();

  const [open, setOpen] = useState(defaultopen);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onOpenChange = (open: boolean) => {
    setOpen(open);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!open && window.history.state.dialogOpen) window.history.back();
  };

  useEffect(() => {
    if (pathname == getServiceBookingRelativeUrl(service, center))
      setOpen(true);
  }, [pathname, service, center]);

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();

      if (open) {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    if (open) {
      const centerPushUrl = `${getCenterRelativeUrl(center)}`;
      const servicePushUrl = `${getServiceBookingRelativeUrl(service, center)}`;

      if (pathname === servicePushUrl) {
        window.history.pushState({}, "", centerPushUrl);
      }

      window.history.pushState({ dialogOpen: true }, "", servicePushUrl);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [open, center, service]);

  const serviceImage = service.images?.[0]?.url;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <div className="absolute bottom-0 flex w-full translate-y-1/2 justify-center">
            <Button variant="primary">Add</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            {/* <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              Select pet, address and slot start time to book service.
            </DialogDescription> */}

            <span className="text-xs">Booking</span>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{service.name}</DialogTitle>
                <span className="-mt-1 text-sm font-semibold text-primary">
                  at {center.name}
                </span>
              </div>
              {serviceImage && (
                <div className="relative aspect-square h-full overflow-hidden rounded-md">
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
          <ServiceBookingForm service={service} user={user} />
          <DialogFooter className="flex w-full flex-row items-center gap-1 pt-2">
            <Button variant="outline" className="w-1/2">
              Add to Cart
            </Button>
            <Button variant="primary" className="w-1/2">
              Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <div className="absolute bottom-0 flex w-full translate-y-1/2 justify-center">
          <Button variant="primary">Add</Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] rounded-t-2xl">
        <DrawerHeader className="text-left">
          <p className="text-xs">Booking</p>
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-base leading-none">
                {service.name}
              </DrawerTitle>
              <span className="-mt-1 text-sm font-semibold text-primary">
                at {center.name}
              </span>
            </div>
            {serviceImage && (
              <div className="relative aspect-square h-full overflow-hidden rounded-md">
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
        <ServiceBookingForm service={service} user={user} className="px-4" />
        <DrawerFooter className="flex w-full flex-row items-center gap-1 pt-2">
          <Button variant="outline" className="w-1/2">
            Add to Cart
          </Button>
          <Button variant="primary" className="w-1/2">
            Checkout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ServiceBookingForm({
  className,
  service,
  user,
}: React.ComponentProps<"form"> & {
  service: Service;
  user?: CustomerUser;
}) {
  const [isAddNewPet, setIsAddNewPet] = useState(false);
  const [accordianValue, setAccordianValue] = useState("pet-details");

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  // const [selectedAddress, setSelectedAddress] =
  //   useState<CustomerAddresses>(null);

  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedSlotDate, setSelectedSlotDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );

  const { data: pets, isLoading: isPetsLoading } =
    api.pet.getPetProfiles.useQuery(undefined, {
      enabled: !!user,
    });

  const { data: slots, isLoading: isSlotsLoading } = api.slot.getSlots.useQuery(
    { serviceId: service.id },
    {
      enabled: !!user,
    },
  );

  // const {
  //   data: addresses,
  //   isLoading: isAddressesLoading,
  //   refetch: refetchAddresses,
  // } = api.customerAddress.getAddresses.useQuery(undefined, {
  //   enabled: !!user,
  // });

  if (isPetsLoading || isSlotsLoading) {
    return (
      <div className="flex flex-col gap-2 px-4 md:px-0">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <form className={cn("grid items-start gap-4 overflow-y-auto", className)}>
      <Accordion
        type="single"
        value={accordianValue}
        onValueChange={setAccordianValue}
        collapsible={true}
        className="space-y-1"
      >
        {/* Booking For */}
        <AccordionItem value="pet-details" className="rounded-lg border">
          <AccordianPreview
            label="Booking For"
            labelValue={selectedPet?.name}
            selectedAccordianValue={accordianValue}
            accordianValue="pet-details"
          />

          <AccordionContent className="border-t px-2 pt-3">
            {user ? (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground/80">
                    Select Pet*
                  </Label>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddNewPet((isAddNewPet) => !isAddNewPet);
                    }}
                    variant={pets?.length ? "secondary" : "primary"}
                    size="sm"
                    className="h-6"
                  >
                    {isAddNewPet ? "Select Existing Pet" : "Add New Pet"}
                  </Button>
                </div>
                {!isAddNewPet ? (
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
                            {pet.images?.[0] ? (
                              <Image
                                src={pet.images?.[0].url}
                                fill
                                className="object-cover"
                                alt=""
                              />
                            ) : (
                              ""
                            )}
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
                  <div>
                    <Label>Pet Name</Label>
                    <Input id="pet-name" placeholder="Pet Name" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span>Login to select pet</span>
                <SignIn />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Address */}
        {/* <AccordionItem value="booking-address" className="rounded-lg border">
          <div
            className={`flex w-full items-center justify-between px-2 ${accordianValue == "booking-address" ? "rounded-t-lg bg-primary/10" : ""}`}
          >
            <span className="text-sm font-semibold">
              Address:{" "}
              {selectedAddress ? (
                <span className="text-primary">{selectedAddress.name}</span>
              ) : (
                <span className="text-destructive">Not Selected</span>
              )}
            </span>
            <div className="w-min">
              <AccordionTrigger className="w-min py-2.5" noIcon>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6"
                >
                  {accordianValue == "booking-address" ? "Close" : "Edit"}
                </Button>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="border-t px-2 pt-3">
            {user ? (
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground/80">
                    Addresses*
                  </Label>
                  <NewAddessModal onAddNewAddress={() => refetchAddresses()} />
                </div>
                <div className="mt-4 flex max-h-60 flex-col gap-2 overflow-y-auto">
                  {addresses?.length ? (
                    addresses.map((address, idx) => (
                      <div
                        key={idx}
                        className={`flex cursor-pointer flex-col gap-0.5 rounded-lg p-1.5 ${selectedAddress?.id == address.id ? "bg-primary/30" : "hover:bg-primary/10"}`}
                        onClick={() => {
                          setTimeout(() => {
                            setAccordianValue("slot-starttime-selection");
                          }, 200);
                          setSelectedAddress(address);
                        }}
                        aria-hidden="true"
                      >
                        <span className="text-sm font-semibold">
                          {address.name}
                        </span>
                        <span className="line-clamp-2 text-xs text-foreground/70">
                          {getFullFormattedAddresses(address)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center text-sm">
                      No address found!
                      <br /> Click{" "}
                      <span className="font-semibold">Add New Address</span> to
                      create new address.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span>Login to select address</span>
                <SignIn />
              </div>
            )}
          </AccordionContent>
        </AccordionItem> */}

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
          />

          <AccordionContent className="max-h-54 grid grid-cols-1 border-t py-3">
            <div className="no-scrollbar overflow-x-auto px-3 pb-3">
              <div className="flex w-max items-center gap-2">
                {slots &&
                  Array.from(slots.entries()).map(([date, dateSlots], idx) => {
                    const availableSlots = dateSlots.filter(
                      (slot) => slot.availableSlots,
                    );

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
                        <span className="font-medium text-green-600">
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
                      <div className="space-y-2 p-3">
                        <div className="flex items-center gap-0.5 font-semibold">
                          <WiSunrise
                            size={25}
                            strokeWidth={0.3}
                            className="text-yellow-600"
                          />
                          <span>Morning</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {morningSlots.map((slot, idx) => (
                            <span
                              key={idx}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setTimeout(() => {
                                  setAccordianValue("");
                                }, 200);
                              }}
                              aria-hidden="true"
                              className={`cursor-pointer rounded-md border p-1.5 text-xs font-semibold ${selectedSlot?.id == slot.id ? "bg-primary/30" : "hover:bg-primary/10"}`}
                            >
                              {convertTime24To12(slot.startTime)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {afternoonSlots?.length && (
                      <div className="space-y-2 p-3">
                        <div className="flex items-center gap-0.5 font-semibold">
                          <WiDaySunny
                            size={25}
                            strokeWidth={0.3}
                            className="text-orange-600"
                          />
                          <span>Afternoon</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {afternoonSlots.map((slot, idx) => (
                            <span
                              key={idx}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setTimeout(() => {
                                  setAccordianValue("");
                                }, 200);
                              }}
                              aria-hidden="true"
                              className={`cursor-pointer rounded-md border p-1.5 text-xs font-semibold ${selectedSlot?.id == slot.id ? "bg-primary/30" : "hover:bg-primary/10"}`}
                            >
                              {convertTime24To12(slot.startTime)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {eveningSlots?.length && (
                      <div className="space-y-2 p-3">
                        <div className="flex items-center gap-0.5 font-semibold">
                          <HiOutlineMoon
                            size={17}
                            strokeWidth={2.2}
                            className="text-slate-500"
                          />
                          <span>Evening</span>
                        </div>{" "}
                        <div className="flex flex-wrap gap-2">
                          {eveningSlots.map((slot, idx) => (
                            <span
                              key={idx}
                              onClick={() => {
                                setSelectedSlot(slot);
                                setTimeout(() => {
                                  setAccordianValue("");
                                }, 200);
                              }}
                              aria-hidden="true"
                              className={`cursor-pointer rounded-md border p-1.5 text-xs font-semibold ${selectedSlot?.id == slot.id ? "bg-primary/30" : "hover:bg-primary/10"}`}
                            >
                              {convertTime24To12(slot.startTime)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </form>
  );
}

const AccordianPreview = ({
  label,
  labelValue,
  accordianValue,
  selectedAccordianValue,
}: {
  label: string;
  labelValue?: string;
  accordianValue: string;
  selectedAccordianValue?: string;
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
          <span className="text-destructive">Not Selected</span>
        )}
      </span>
      <div className="w-min">
        <AccordionTrigger className="w-min py-2" noIcon>
          <Button type="button" variant="outline" size="sm" className="h-6">
            {selectedAccordianValue == accordianValue ? "Close" : "Edit"}
          </Button>
        </AccordionTrigger>
      </div>
    </div>
  );
};

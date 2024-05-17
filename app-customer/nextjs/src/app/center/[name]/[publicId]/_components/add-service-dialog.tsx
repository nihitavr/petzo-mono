"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import type { Center, CustomerUser, Pet, Service } from "@petzo/db";
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
import { cn } from "@petzo/ui/lib/utils";

import SignIn from "~/app/_components/sign-in";
import { useMediaQuery } from "~/lib/hooks/screen.hooks";
import {
  getCenterRelativeUrl,
  getServiceBookingRelativeUrl,
} from "~/lib/utils/center.utils";
import { api } from "~/trpc/react";

export function AddServiceDialog({
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!open && window.history.state.dialogOpen) window.history.back();
    setOpen(open);
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
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              Select pet, address and slot start time to book service.
            </DialogDescription>
          </DialogHeader>
          <ServiceBookingForm />
        </DialogContent>
      </Dialog>
    );
  }

  const serviceImage = service.images?.[0]?.url;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <div className="absolute bottom-0 flex w-full translate-y-1/2 justify-center">
          <Button variant="primary">Add</Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerClose className="absolute right-4 top-2" asChild>
          <span className="text-xl font-semibold">X</span>
        </DrawerClose>
        <DrawerHeader className="text-left">
          <p className="text-xs">Booking</p>
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle>{service.name}</DrawerTitle>
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
          {/* <DrawerDescription>
            Select pet, address and slot start time to book service.
          </DrawerDescription> */}
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
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { data: pets, isLoading } = api.pet.getPetProfiles.useQuery(undefined, {
    enabled: !!user,
  });

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
          <div
            className={`flex w-full items-center justify-between px-2 ${accordianValue == "pet-details" ? "rounded-lg bg-muted" : ""}`}
          >
            <span className="text-sm font-semibold">
              Booking For:{" "}
              {selectedPet ? (
                <span className="text-primary">{selectedPet.name}</span>
              ) : (
                <span className="text-foreground/70">Not Selected</span>
              )}
            </span>
            <div className="w-min">
              <AccordionTrigger className="w-min py-3" noIcon>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6"
                >
                  {accordianValue == "pet-details" ? "Close" : "Edit"}
                </Button>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="border-t px-2 pt-3">
            {user ? (
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground/80">
                    Pet Details*
                  </Label>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddNewPet((isAddNewPet) => !isAddNewPet);
                    }}
                    variant="outline"
                    size="sm"
                    className="h-7"
                  >
                    {isAddNewPet ? "Select Existing Pet" : "Add New Pet"}
                  </Button>
                </div>
                {!isAddNewPet ? (
                  <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
                    {pets?.map((pet, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col gap-1 rounded-lg p-2 ${pet.publicId == selectedPet?.publicId ? "border bg-primary/30" : "hover:bg-primary/10"}`}
                        onClick={() => setSelectedPet(pet)}
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
                    ))}
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
        <AccordionItem value="booking-address" className="rounded-lg border">
          <div
            className={`flex w-full items-center justify-between px-2 ${accordianValue == "booking-address" ? "rounded-lg bg-muted" : ""}`}
          >
            <span className="text-sm font-semibold">
              Address: <span className="text-primary">Home</span>
            </span>
            <div className="w-min">
              <AccordionTrigger className="w-min py-3" noIcon>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6"
                >
                  Edit
                </Button>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="border-t px-2 pt-3">
            <div className="h-32">This is address content</div>
          </AccordionContent>
        </AccordionItem>

        {/* Start Time */}
        <AccordionItem
          value="slot-starttime-selection"
          className="rounded-lg border"
        >
          <div
            className={`flex w-full items-center justify-between px-2 ${accordianValue == "slot-starttime-selection" ? "rounded-lg bg-muted" : ""}`}
          >
            <span className="text-sm font-semibold">
              Start Time:{" "}
              <span className="text-primary">25th May 10:30 PM</span>
            </span>
            <div className="w-min">
              <AccordionTrigger className="w-min py-3" noIcon>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6"
                >
                  Edit
                </Button>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="border-t px-2 pt-3">
            <div className="h-32">This is slot content</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </form>
  );
}

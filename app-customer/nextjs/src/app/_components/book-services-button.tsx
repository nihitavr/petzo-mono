"use client";

import { useEffect, useMemo, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import Loader from "@petzo/ui/components/loader";
import { toast } from "@petzo/ui/components/toast";
import { centerUtils, validationUtils } from "@petzo/utils";

import { servicesCart } from "~/lib/storage/service-cart-storage";
import { api } from "~/trpc/react";

export default function BookServicesButton({
  setBookingId,
  disabled,
}: {
  setBookingId: (value: number | undefined) => void;
  disabled?: boolean;
}) {
  useSignals();

  const [open, setOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const bookingService = api.booking.bookService.useMutation();

  const hasAtHomeService = useMemo(
    () =>
      centerUtils.hasAtHomeServices(
        servicesCart.value.items?.map((item) => item.service),
      ),
    [servicesCart.value.items?.length],
  );

  const onClickBookServices = async () => {
    try {
      setIsBooking(true);
      const booking = await bookingService.mutateAsync({
        centerId: servicesCart.value.center.id,
        addressId: hasAtHomeService
          ? servicesCart.value.address?.id
          : undefined,
        phoneNumber: servicesCart.value.phoneNumber,
        items: servicesCart.value.items.map((item) => ({
          serviceId: item.service.id,
          slotId: item.slot.id,
          petId: item.pet.id,
        })),
      });

      setBookingId(booking);
    } catch (e) {
      if (e instanceof TRPCClientError || e instanceof TRPCError) {
        toast.error("Failed to book services. Please try again later.");
      }
    }

    setIsBooking(false);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const isDisabled =
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    disabled ||
    (hasAtHomeService && !servicesCart.value?.address?.id) ||
    (!hasAtHomeService &&
      !validationUtils.validatePhoneNumber(
        servicesCart.value?.phoneNumber,
      )[0]) ||
    !servicesCart.value?.items?.length ||
    !servicesCart.value.center;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={isDisabled ? `pointer-events-none` : ""}
        asChild
      >
        <div className="fixed bottom-0 left-0 z-10 w-full bg-background px-3 pt-0 md:left-auto md:right-3 md:w-72 md:px-0 lg:right-24 xl:right-48">
          <Button
            disabled={isDisabled}
            className="flex h-11 w-full -translate-y-[40%] items-center gap-1 rounded-xl bg-green-700 caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)] shadow-green-700/50 hover:bg-green-700/90"
          >
            <span className="font-semibold">Book Services</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4 rounded-xl">
        <span>
          Please click <span className="font-semibold">Yes</span> to complete
          the booking.
        </span>
        <div className="flex w-full items-center gap-2 md:justify-end">
          <DialogClose asChild className="!w-1/2">
            <Button className="w-full" variant="outline" disabled={isBooking}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onClickBookServices}
            variant="primary"
            className="flex w-1/2 items-center gap-1"
            disabled={isBooking}
          >
            Yes <Loader className="size-4 border-2" show={isBooking} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

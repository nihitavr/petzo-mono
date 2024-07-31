"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Booking, BookingItem } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import Loader from "@petzo/ui/components/loader";
import { toast } from "@petzo/ui/components/toast";

import { api } from "~/trpc/react";
import BookingItemInfo from "./booking-item-info";

export default function CompleteBookingButton({
  centerPublicId,
  booking,
  bookingItem,
}: {
  centerPublicId: string;
  booking: Booking;
  bookingItem: BookingItem;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [confirmBookingLoading, setConfirmBooking] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const completeBooking = api.booking.completeBookingItem.useMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || bookingItem.status !== "ongoing") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <Button size="md" variant="primary" className="w-full">
          <span>Complete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-2 rounded-xl">
        <h3 className="font-semibold">Booking Item Id: {bookingItem.id}</h3>
        <div className="rounded-lg border p-2">
          <BookingItemInfo bookingItem={bookingItem} />
        </div>
        <span className="font-semibold">
          Are you sure you want to{" "}
          <span className="text-primary">complete</span> the booking?
        </span>
        <div className="flex w-full items-center gap-2">
          <DialogClose
            disabled={confirmBookingLoading}
            asChild
            className="!w-1/2"
          >
            <Button className="w-full" variant="outline">
              No
            </Button>
          </DialogClose>
          <Button
            disabled={confirmBookingLoading}
            onClick={async () => {
              setConfirmBooking(true);
              try {
                await completeBooking.mutateAsync({
                  centerPublicId: centerPublicId,
                  bookingId: booking.id,
                  bookingItemId: bookingItem.id,
                });
              } catch (e) {
                // Pass
                toast.error(
                  "Failed to complete the booking. Please try again later.",
                );
              }
              setConfirmBooking(false);
              setOpen(false);
              router.refresh();
            }}
            className="flex w-1/2 items-center gap-1"
          >
            Yes{" "}
            <Loader className="size-4 border-2" show={confirmBookingLoading} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

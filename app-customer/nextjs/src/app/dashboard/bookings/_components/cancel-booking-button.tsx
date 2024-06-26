"use client";

import { MdOutlineCancel } from "react-icons/md";

import { Button } from "@petzo/ui/components/button";
import { toast } from "@petzo/ui/components/toast";

export function CancelBookingButton() {
  return (
    <Button
      size="sm"
      variant="outline"
      className="w-full space-x-0.5"
      onClick={() => {
        toast.error("Booking Cancellation is not allowed at the moment.");
      }}
    >
      <span>Cancel Booking</span>
      <MdOutlineCancel className="size-4" />
    </Button>
  );
}

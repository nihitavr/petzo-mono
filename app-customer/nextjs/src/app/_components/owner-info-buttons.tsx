"use client";

import { LuCopy, LuPhoneOutgoing } from "react-icons/lu";

import { Button } from "@petzo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@petzo/ui/components/popover";

export default function OwnerInfoButtons({
  phoneNumber,
}: {
  phoneNumber?: string;
}) {
  return (
    <div className="sticky bottom-0 border-t bg-white pb-3 pt-1">
      <div className="pb-2 text-center text-sm font-semibold text-red-600">
        Found Pet? <br />
        Share your location or Call Owner.*
      </div>
      <div className="grid grid-cols-12 gap-2">
        <Button
          className="col-span-10 gap-1 md:w-full"
          onClick={() => {
            window.open(`tel:${phoneNumber}`, "_self");
          }}
        >
          <span>Call Owner</span>
          <LuPhoneOutgoing className="h-3.5 w-3.5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild className="col-span-2 !w-full">
            <Button
              className="w-full p-2"
              onClick={async () => {
                if (phoneNumber) {
                  await navigator?.clipboard?.writeText(phoneNumber);
                }
              }}
              variant={"outline"}
            >
              <LuCopy className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-fit p-2">
            <p className="p-0 text-xs">Phone Number Copied</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { format, parse } from "date-fns";
import { MdDelete } from "react-icons/md";

import { Pet, Service, Slot } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { Label } from "@petzo/ui/components/label";

import Price from "~/app/_components/price";
import {
  removeItemFromServicesCart,
  servicesCart,
} from "~/lib/storage/service-cart-storage";

export default function Page() {
  useSignals();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <div>
      <div className="flex items-center justify-start gap-2">
        <h1 className="text-xl font-semibold">Cart</h1>
      </div>
      <div className="rounded-xl bg-primary/10 p-2 pb-4 pt-1.5">
        <Label className="text-xs text-foreground/80">Center</Label>
        <h3 className="line-clamp-1 text-sm font-semibold">
          {servicesCart.value?.center?.name}
        </h3>

        <div className="mt-2 rounded-xl bg-background px-2.5 py-1.5">
          <Label className="text-xs text-foreground/80">Services</Label>
          <CartServicesList items={servicesCart.value?.items} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-10 w-full bg-background px-3 pt-0">
        <Button className="flex h-11 w-full -translate-y-[40%] rounded-xl bg-green-600 caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)] shadow-green-600/80 hover:bg-green-600/90">
          <span className="font-semibold">Book Services</span>
        </Button>
      </div>
    </div>
  );
}

const CartServicesList = ({
  items,
}: {
  items: {
    service: Service;
    slot: Slot;
    pet: Pet;
  }[];
}) => {
  return (
    <div className="flex flex-col gap-3">
      {items?.map((item, idx) => (
        <div
          key={item.service.id}
          className="flex items-start justify-between gap-2 text-sm"
        >
          <div className="flex flex-col">
            <span className="line-clamp-1 text-sm font-semibold">
              {item.service.name}
            </span>
            <span className="line-clamp-1 text-xs text-foreground/70">
              Booking for: {item.pet.name}
            </span>
            <span className="line-clamp-1 text-xs text-foreground/70">
              Start Time:{" "}
              {format(
                parse(
                  item.slot.startTime,
                  "HH:mm:ss",
                  new Date(item.slot.date),
                ),
                "EEE do MMM, h:mm a",
              )}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Price className="font-semibold" price={item.service.price} />
            <MdDelete
              className="size-5 cursor-pointer text-foreground/50 hover:text-foreground/30"
              onClick={() => removeItemFromServicesCart(idx)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

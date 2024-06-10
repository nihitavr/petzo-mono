"use client";

import { useEffect, useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { FaArrowRight } from "react-icons/fa6";

import { Button } from "@petzo/ui/components/button";

import { servicesCart } from "~/lib/storage/service-cart-storage";

export default function ViewCartButton() {
  useSignals();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!servicesCart?.value?.items?.length || !isLoaded) return null;

  return (
    <div className="fixed bottom-0 left-0 z-10 w-full bg-background px-3 pb-4 pt-0">
      <Button className="flex h-11 w-full justify-between rounded-xl caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)] shadow-primary/80">
        <span>
          {servicesCart?.value?.items?.length} item
          {servicesCart?.value?.items?.length == 1 ? "" : "s"}
        </span>{" "}
        <div className="flex items-center gap-1">
          <span className="font-semibold">View</span>
          <FaArrowRight />
        </div>
      </Button>
    </div>
  );
}

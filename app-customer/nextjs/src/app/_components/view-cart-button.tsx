"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";
import { FaArrowRight } from "react-icons/fa6";

import { Button } from "@petzo/ui/components/button";

import { servicesCart } from "~/lib/storage/service-cart-storage";

export default function ViewCartButton() {
  useSignals();

  const pathname = usePathname();
  const router = useRouter();

  const [shouldBeVisible, setShouldBeVisible] = useState(false);

  useEffect(() => {
    if (
      pathname.endsWith("/explore") ||
      pathname.endsWith("/centers") ||
      pathname.startsWith("/center")
    ) {
      setShouldBeVisible(true);
    } else {
      setShouldBeVisible(false);
    }
  }, [pathname]);

  if (!servicesCart?.value?.items?.length || !shouldBeVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-10 w-full bg-background px-3 pt-0">
      <Button
        onClick={() => {
          router.push("/checkout/services");
        }}
        className="flex h-11 w-full -translate-y-[40%] justify-between rounded-xl bg-green-700 caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)] shadow-green-700/50 hover:bg-green-700/80"
      >
        <span>
          {servicesCart?.value?.items?.length} service
          {servicesCart?.value?.items?.length == 1 ? "" : "s"} added
        </span>{" "}
        <div className="flex items-center gap-1">
          <span className="font-semibold">View</span>
          <FaArrowRight />
        </div>
      </Button>
    </div>
  );
}

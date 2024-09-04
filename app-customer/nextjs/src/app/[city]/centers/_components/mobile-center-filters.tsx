"use client";

import type { z } from "zod";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaFilter } from "react-icons/fa";

import type { centerValidator } from "@petzo/validators";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";
import { cn } from "@petzo/ui/lib/utils";

import { CenterFilters } from "./center-filters";

type CenterFilterFormSchemaType = z.infer<typeof centerValidator.FormFilters>;

export function MobileCenterFilters({
  filters,
}: {
  filters: CenterFilterFormSchemaType;
}) {
  const searchParams = useSearchParams();
  const isFilterSelected = useMemo(
    () => !!searchParams.has("area") || !!searchParams.has("ratingGte"),
    [searchParams],
  );

  console.log("isFilterSelected: ", isFilterSelected);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        onClick={() => {
          setIsOpen(true);
        }}
        className={cn(
          "flex items-center gap-1 rounded-full border px-3 py-1",
          isFilterSelected
            ? "border-primary bg-primary/10"
            : "border-foreground/50 text-foreground",
        )}
      >
        <span className="text-sm">Filter By</span>

        <FaFilter
          className={cn(
            "mt-0.5 h-3.5 text-foreground/70",
            isFilterSelected ? "" : "",
          )}
        />
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-h-[80vh] overflow-auto pb-10">
          <CenterFilters onApply={() => setIsOpen(false)} filters={filters} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

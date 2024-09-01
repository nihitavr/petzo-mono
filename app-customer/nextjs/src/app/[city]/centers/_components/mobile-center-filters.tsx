"use client";

import type { z } from "zod";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";

import type { centerValidator } from "@petzo/validators";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";

import { CenterFilters } from "./center-filters";

type CenterFilterFormSchemaType = z.infer<typeof centerValidator.FormFilters>;

export function MobileCenterFilters({
  filters,
}: {
  filters: CenterFilterFormSchemaType;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        onClick={() => {
          setIsOpen(true);
        }}
        className="flex items-center gap-1 rounded-full border px-3 py-1"
      >
        <span className="text-sm">Filter By</span>

        <FaFilter className="mt-0.5 h-3.5 text-foreground/50" />
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-h-[500px] overflow-auto pb-10">
          <CenterFilters onApply={() => setIsOpen(false)} filters={filters} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

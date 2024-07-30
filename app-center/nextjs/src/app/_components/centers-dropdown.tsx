"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";
import { LuCheck, LuChevronDown } from "react-icons/lu";

import type { Center } from "@petzo/db";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@petzo/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@petzo/ui/components/popover";
import { cn } from "@petzo/ui/lib/utils";

import { selectedCenterPublicId } from "~/lib/store/global-storage";

export default function CentersDropdown({ centers }: { centers?: Center[] }) {
  useSignals();
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);

  const selectedCenter = useMemo(() => {
    return centers?.find(
      (city) => city.publicId === selectedCenterPublicId.value,
    );
  }, [selectedCenterPublicId.value, centers]);

  useEffect(() => {
    if (
      !!params.centerPublicId &&
      params.centerPublicId !== selectedCenterPublicId.value
    ) {
      selectedCenterPublicId.value = params.centerPublicId as string;
    } else if (centers?.length) {
      selectedCenterPublicId.value = centers[0]?.publicId;
    }
  }, [params.centerPublicId, centers]);

  if (!centers || centers?.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer flex-col items-center">
          <div className="flex w-full items-center justify-end">
            <span className="text-2xs text-foreground/70">Center</span>
            <div className="flex items-center">
              <LuChevronDown className="size-5 text-foreground/80" />
            </div>
          </div>
          <span className="-mt-0.5 line-clamp-1 break-all text-2sm font-semibold text-foreground/70 md:text-sm">
            {selectedCenter?.name}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="no-scrollbar max-w-60 p-0" align="end">
        <Command
          className="no-scrollbar"
          shouldFilter={false}
          value={selectedCenter?.publicId}
        >
          <CommandList>
            <CommandEmpty>No Center found.</CommandEmpty>
            <CommandGroup className="no-scrollbar">
              {centers?.map((center) => (
                <CommandItem
                  className="cursor-pointer text-xs hover:bg-muted/70"
                  key={`${center.publicId}`}
                  value={`${center.publicId}`}
                  onSelect={(centerPublicId) => {
                    if (selectedCenterPublicId.value !== centerPublicId) {
                      selectedCenterPublicId.value = centerPublicId;
                      router.push(`/dashboard/${centerPublicId}`);
                    }
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <LuCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCenterPublicId.value === center.publicId
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex w-full flex-col rounded-md text-xs md:text-sm">
                      <span className="line-clamp-1 break-all font-semibold">
                        {center.name}
                      </span>
                      <span className="line-clamp-1 break-all text-2xs md:text-xs">
                        {center.centerAddress?.area.name},{" "}
                        {center.centerAddress?.city.name}
                      </span>{" "}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

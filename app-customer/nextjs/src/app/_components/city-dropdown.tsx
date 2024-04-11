"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";

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

import { filtersStore } from "~/lib/storage/global-storage";

export default function CityDropdown({
  cities,
  defaultCityPublicId,
}: {
  cities: {
    name: string;
    publicId: string;
  }[];
  defaultCityPublicId?: string;
}) {
  useSignals();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer items-center">
          <SlLocationPin className="size-5 text-foreground/70" />
          <LuChevronDown className="size-5 text-foreground/70" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0" align="end">
        <Command shouldFilter={false} value={defaultCityPublicId}>
          <CommandList>
            <CommandEmpty>No City found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  className="cursor-pointer"
                  key={`${city.publicId}`}
                  value={`${city.publicId}`}
                  onSelect={(currentCityId) => {
                    if (filtersStore.city.value !== currentCityId) {
                      filtersStore.city.value = currentCityId;

                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.set("city", currentCityId);
                      router.push(`${pathname}?${params.toString()}`);
                    }

                    setOpen(false);
                  }}
                >
                  <LuCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      filtersStore.city.value === city.publicId
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

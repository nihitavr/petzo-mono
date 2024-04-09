"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import { Button } from "@petzo/ui/components/button";
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

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const selectedCityName = cities.find(
    (city) =>
      city.publicId === defaultCityPublicId ||
      city.publicId === filtersStore.city.value,
  )?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between rounded-md"
        >
          {selectedCityName}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
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
                      router.push(`/centers?city=${currentCityId}`);
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

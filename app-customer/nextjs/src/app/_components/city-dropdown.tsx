"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { SlLocationPin } from "react-icons/sl";

import { City } from "@petzo/db";
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
  cities: City[];
  defaultCityPublicId?: string;
}) {
  useSignals();
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);

  const selectedCity = useMemo(() => {
    return cities.find((city) => city.publicId === filtersStore.city.value);
  }, [filtersStore.city.value, cities]);

  useEffect(() => {
    if (!!params.city && params.city !== filtersStore.city.value) {
      filtersStore.city.value = params.city as string;
    }
  }, [params.city]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer flex-col items-center gap-0.5">
          <span className="line-clamp-1 text-[0.7rem] font-semibold text-foreground/70">
            {selectedCity?.name}
          </span>
          <div className="flex items-center">
            <SlLocationPin className="size-5 text-foreground/70" />
            <LuChevronDown className="size-5 text-foreground/70" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0" align="end">
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
                      router.push(`/${currentCityId}/explore`);
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

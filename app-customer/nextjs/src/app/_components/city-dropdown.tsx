"use client";

import { useState } from "react";
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

const cities = [
  {
    id: "bengaluru",
    name: "Bengaluru",
  },
  {
    id: "mumbai",
    name: "Mumbai",
  },
];

export default function CityDropdown() {
  const [open, setOpen] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("bengaluru");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-32 justify-between"
        >
          {selectedCityId
            ? cities.find((city) => city.id.toString() === selectedCityId)?.name
            : "Select City..."}
          <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32 p-0">
        <Command shouldFilter={false}>
          {/* <CommandInput placeholder="Search City..." /> */}
          <CommandList>
            <CommandEmpty>No City found.</CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  className="cursor-pointer"
                  key={`${city.id}`}
                  value={`${city.id}`}
                  onSelect={(currentCityId) => {
                    setSelectedCityId(
                      currentCityId === selectedCityId.toString()
                        ? ""
                        : currentCityId,
                    );
                    setOpen(false);
                  }}
                >
                  <LuCheck
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCityId === city.id.toString()
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

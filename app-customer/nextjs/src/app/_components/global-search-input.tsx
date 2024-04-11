"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signal } from "@preact/signals-react";
import { FaSearch } from "react-icons/fa";

import { Input } from "@petzo/ui/components/input";

import { filtersStore } from "~/lib/storage/global-storage";

export const MIN_SEARCH_TEXT_LENGTH = 3;

const PLACEHOLDERS = [
  "Veterinary Center",
  "Grooming Center",
  "Boarding Center",
];

export default function GlobalSearchInput({
  focusOnLoad,
}: {
  focusOnLoad?: boolean;
}) {
  const [input, setInput] = useState(filtersStore.search.value);

  const ref = useRef<HTMLInputElement>(null);

  // Focus on input field when the component is loaded.
  useEffect(() => {
    if (focusOnLoad && ref.current) {
      ref.current.focus();
    }
  }, [focusOnLoad]);

  // Debounce search input. This will update the search signal value only after 300ms of inactivity in the input field.
  useEffect(() => {
    if (
      input == undefined ||
      (input.length > 0 && input.length < MIN_SEARCH_TEXT_LENGTH) ||
      input?.trim() == filtersStore.search.value
    ) {
      return;
    }

    const getData = setTimeout(() => {
      filtersStore.search.value = input;
    }, 300);

    return () => clearTimeout(getData);
  }, [input]);

  const currentPlaceholderIndex = signal(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const updatePlaceholder = async () => {
        // loop characters of a  string
        const tempCurrentIndex =
          (currentPlaceholderIndex.value + 1) % PLACEHOLDERS.length || 0;
        const placeholder = PLACEHOLDERS[tempCurrentIndex]!;

        const letterSleepTime = 1200 / placeholder.length;

        if (ref.current) {
          for (let i = 0; i < placeholder.length; i++) {
            placeholder.charAt(i);
            
            if (ref.current) {
              ref.current.placeholder = `Search by ${placeholder.slice(0, i + 1)}`;
            }

            await new Promise((resolve) =>
              setTimeout(resolve, letterSleepTime),
            );
          }
          currentPlaceholderIndex.value = tempCurrentIndex;
        }
      };

      void updatePlaceholder();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      setInput("");
    };
  }, []);

  return (
    <div className="relative w-full md:w-60">
      <Link href={"/search"}>
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          ref={ref}
          placeholder="Search by Veterinary Center"
          className="h-11 w-full rounded-full px-5 caret-primary !shadow-sm focus-visible:ring-primary md:w-60"
        />
      </Link>
      {input?.length ? (
        <button
          onClick={() => {
            filtersStore.search.value = "";
            setInput("");
          }}
          className="absolute right-5 top-1/2 -translate-y-1/2 font-semibold text-foreground/50"
        >
          X
        </button>
      ) : (
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50" />
      )}
    </div>
  );
}

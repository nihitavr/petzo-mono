"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signal } from "@preact/signals-react";
import { FaSearch } from "react-icons/fa";

import { Input } from "@petzo/ui/components/input";

import { filtersStore } from "~/lib/storage/global-storage";

export const MIN_SEARCH_TEXT_LENGTH = 3;
export const MAX_SEARCH_PLACEHOLDER_REPETITIONS = 9;

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const router = useRouter();
  const [input, setInput] = useState(filtersStore.search.value);

  const ref = useRef<HTMLInputElement>(null);

  // Set search input to the value of the query parameter from the url.
  useEffect(() => {
    if (q) setInput(q);
  }, [q]);

  // Set search input to empty when the user navigates to a different page.
  useEffect(() => {
    if (!pathname.endsWith("/search")) {
      setInput("");
      filtersStore.search.value = "";
    }
  }, [pathname]);

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
      router.replace(`/${filtersStore.city.value}/search?q=${input}`);
    }, 300);

    return () => clearTimeout(getData);
  }, [input]);

  const currentPlaceholderIndex = signal(0);
  useEffect(() => {
    console.log("prefetching search");

    router.prefetch("/search");

    let currentIntervalCount = 0;
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

        if (++currentIntervalCount === MAX_SEARCH_PLACEHOLDER_REPETITIONS) {
          clearInterval(interval);
        }
      };

      void updatePlaceholder();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative w-full md:w-72">
      <Link href={`/${filtersStore.city.value}/search`}>
        <Input
          value={input ?? ""}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          ref={ref}
          placeholder="Search by Veterinary Center"
          className="h-11 w-full rounded-full px-5 caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)]
          shadow-primary/35 focus-visible:ring-primary md:w-72"
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

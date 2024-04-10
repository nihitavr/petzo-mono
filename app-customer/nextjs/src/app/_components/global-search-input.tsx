import { FaSearch } from "react-icons/fa";

import { Input } from "@petzo/ui/components/input";

export default function GlobalSearchInput() {
  return (
    <div className="relative w-full md:w-60">
      <Input
        placeholder="Search by Center"
        className="h-11 w-full rounded-full px-5 shadow-sm focus-visible:ring-primary md:w-60"
      />
      <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50" />
    </div>
  );
}

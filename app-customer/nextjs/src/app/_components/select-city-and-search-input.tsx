import { cn } from "@petzo/ui/lib/utils";

import { api } from "~/trpc/server";
import CityDropdown from "./city-dropdown";
import GlobalSearchInput from "./global-search-input";

export async function SelectCityAndSearch({
  className,
  defaultCityPublicId,
}: {
  className?: string;
  defaultCityPublicId?: string;
}) {
  const cities = await api.city.getAll();

  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      {/* <CityDropdown cities={cities} defaultCityPublicId={defaultCityPublicId} /> */}
      <GlobalSearchInput />
    </div>
  );
}

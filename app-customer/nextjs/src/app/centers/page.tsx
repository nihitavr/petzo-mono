import Image from "next/image";

import { api } from "~/trpc/server";
import CityDropdown from "../_components/city-dropdown";
import GlobalSearchInput from "../_components/global-search-input";

export default async function Centers({
  searchParams: { city, serviceType, search, area, rating },
}: {
  searchParams: {
    city: string;
    serviceType: string;
    search: string;
    area: string;
    rating: string;
  };
}) {
  const centers = await api.center.findByFilters({
    city,
    serviceType,
    search,
    area,
    rating: +rating || 0,
  });
  
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex items-center gap-2">
        <CityDropdown />
        <GlobalSearchInput />
      </div>

      <div className="flex gap-2">
        <div className="rounded-lg border p-2 px-2 py-1">Filter By</div>
        <div className="rounded-lg border px-2 py-1">Sort (Top Rated)</div>
      </div>

      <div className="flex flex-col gap-3">
        {centers.length > 0 &&
          centers.map((center) => {
            return (
              <div
                key={center.id}
                className="flex flex-row rounded-lg border bg-muted shadow-md"
              >
                <div className="flex h-52 w-full gap-2">
                  {/* Center Image */}
                  <div className="relative h-full w-2/5 overflow-hidden rounded-lg">
                    {center?.images?.[0].url && (
                      <Image
                        src={center?.images?.[0].url}
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>

                  {/* Center Details */}
                  <div>
                    <div className="flex-grow">
                      <h2 className="text-xxl font-bold">{center.name}</h2>
                      <p className="mt-2 text-sm">{center.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-bold uppercase text-primary">
                        {center.averageRating} / 5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

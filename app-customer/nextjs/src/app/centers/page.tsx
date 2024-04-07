import Image from "next/image";
import { FaStar } from "react-icons/fa";

import type { Center, Service } from "@petzo/db";
import { Checkbox } from "@petzo/ui/components/checkbox";

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
  let centers = (await api.center.findByFilters({
    city,
    serviceType,
    search,
    area,
    rating: +rating || 0,
  })) as Center[];

  centers = [...centers, ...centers, ...centers, ...centers];

  const serviceTypesProvided = centers.reduce((acc, center) => {
    center.services.forEach((service: Service) => {
      if (!acc.includes(service.serviceType)) {
        acc.push(service.serviceType);
      }
    });
    return acc;
  }, [] as string[]);

  const getLowertCostService = (center: Center) => {
    return center.services.reduce((acc, service) => {
      if (service.price < acc?.price) {
        return service;
      }
      return acc;
    }, center.services[0]!);
  };

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

      <div className="flex w-full gap-3">
        {/* Filters */}
        <div className="hidden h-full w-3/12 flex-col gap-3 rounded-lg border px-4 py-4 md:flex">
          <h3 className="text-lg font-semibold">Filters</h3>

          {/* Service Type Filter */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground/80">
              Service Type
            </span>

            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Veterinary
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Grooming
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Boarding
              </label>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground/80">
              Rating
            </span>

            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {">"} 4
              </label>
            </div>
          </div>

          {/* Area Filter */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-foreground/80">
              Area
            </span>

            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                HSR Layout
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bommanahalli
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Koramangala
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="service-type-veterinary" />
              <label
                htmlFor="service-type-veterinary"
                className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                BTM Layout
              </label>
            </div>
          </div>
        </div>

        {/* Centers List */}
        <div className="flex w-full flex-col gap-3">
          {centers.length > 0 &&
            centers.map((center) => {
              const lowestPriceService = getLowertCostService(center);
              return (
                <div
                  key={center.id}
                  className="flex flex-row rounded-lg border "
                >
                  <div className="flex h-44 w-full gap-2 md:h-60">
                    {/* Center Image */}
                    <div className="relative h-full w-2/5 cursor-pointer overflow-hidden rounded-lg">
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
                    <div className="flex w-3/5 flex-col gap-1 p-1 md:gap-1.5 md:p-2.5">
                      {/* Center Name */}
                      <h2 className="cursor-pointer font-bold hover:underline md:text-xl">
                        {center.name}
                      </h2>

                      {/* Rating and Reviews */}
                      <div className="md:text-md flex items-center gap-2 text-sm text-foreground/80">
                        <div className="flex items-center gap-1">
                          <span className="">{center.averageRating}</span>
                          <FaStar className="h-3.5 w-3.5 text-yellow-600" />
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-foreground/80"></div>
                        <div className="flex cursor-pointer items-center gap-1 hover:underline">
                          <span>{center.averageRating} reviews</span>
                        </div>
                      </div>

                      {/* Area */}
                      <span className="line-clamp-1 text-sm font-medium capitalize md:text-base">
                        {center.centerAddress.area.name}
                      </span>

                      {/* Services Provided */}
                      <span className="md:text-md line-clamp-1 text-sm capitalize text-foreground/80">
                        {serviceTypesProvided.join(", ")}
                      </span>

                      {/* Lowest Service Price */}
                      <div className="mt-1 flex flex-col md:mt-auto">
                        <span className="-mb-1 text-xs capitalize text-foreground/80 md:text-sm">
                          {lowestPriceService.serviceType} <br />
                        </span>
                        <div className="text-md flex items-center justify-between md:text-lg">
                          <span>Starting at </span>
                          <span className="text-lg font-semibold text-green-700 md:text-xl">
                            &#8377; {lowestPriceService.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

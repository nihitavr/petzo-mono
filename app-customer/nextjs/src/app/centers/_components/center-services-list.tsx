"use client";

import { useEffect, useMemo, useState } from "react";

import type { Center } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";

import { COLOR_MAP, SERVICES_OFFERED } from "~/lib/constants";
import {
  geServiceTypeToServicesByCenterMap,
  getServicesProvidedByCenter,
} from "~/lib/utils/center.utils";

export default function CenterServicesList({ center }: { center: Center }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const serviceTypesProvided = useMemo(() => {
    return getServicesProvidedByCenter(center);
  }, [center]);

  useEffect(() => {
    setSelectedServices(serviceTypesProvided);
  }, [serviceTypesProvided]);

  const serviceMap = useMemo(() => {
    return geServiceTypeToServicesByCenterMap(center);
  }, [center]);

  const onClickServicesFilter = (servicePublicId: string) => {
    if (selectedServices.includes(servicePublicId)) {
      setSelectedServices(
        selectedServices.filter((service) => service !== servicePublicId),
      );
    } else {
      setSelectedServices([...selectedServices, servicePublicId]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* <h3 className="text-center text-3xl font-semibold">Our Services</h3> */}

      {/* Service Type Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        {serviceTypesProvided.map((serviceType) => {
          const isFilterSelected = selectedServices.includes(serviceType);

          return (
            <button
              className={`flex items-center gap-2 rounded-full border px-4 py-2 ${isFilterSelected ? "bg-primary/20" : ""}`}
              key={serviceType}
              onClick={() => onClickServicesFilter(serviceType)}
            >
              <span>{SERVICES_OFFERED[serviceType]?.name}</span>
              {isFilterSelected && (
                <span className="font-semibold hover:scale-125 hover:text-foreground/50">
                  {" X"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Service List */}
      <div className="flex flex-col gap-10">
        {serviceTypesProvided.map((serviceType, idx) => {
          const services = serviceMap[serviceType];

          return selectedServices.includes(serviceType) ? (
            <div className="flex w-full flex-col gap-3" key={`services-${idx}`}>
              <h4 className="text-center text-2xl font-semibold">
                {SERVICES_OFFERED[serviceType]?.name}
              </h4>

              <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                {services?.map((service) => {
                  return (
                    // Service Card Container
                    <div
                      className="col-span-1 flex justify-between rounded-lg bg-primary/5"
                      key={`services-${idx}-${service.id}`}
                    >
                      {/* Service Info */}
                      <div className="flex flex-col p-3">
                        <span className="font-semibold md:text-lg">
                          {service.name}
                        </span>
                        <span className="text-lg font-semibold text-primary">
                          {" "}
                          &#8377; {service.price}
                        </span>
                      </div>

                      {/* Service Image */}
                      <div className="relative">
                        {false ? (
                          <div className=""></div>
                        ) : (
                          <div
                            className={`relative flex size-32 items-center justify-center rounded-lg text-center md:size-40 ${COLOR_MAP[service.name[0]!.toLowerCase()]?.bgColor} bg-opacity-75`}
                          >
                            <div
                              className={`text-5xl ${COLOR_MAP[service.name[0]!.toLowerCase()]?.textColor}`}
                            >
                              {service.name[0]}
                            </div>
                            <Button
                              variant="outline"
                              className="absolute bottom-0 translate-y-1/2"
                            >
                              Add
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          );
        })}
      </div>

      {/*  */}
    </div>
  );
}

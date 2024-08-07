"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { SERVICE_TYPE } from "@petzo/constants";
import type { Center, CenterConfig } from "@petzo/db";
import { SERVICES_CONFIG } from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import Loader from "@petzo/ui/components/loader";

import { api } from "~/trpc/react";

export default function ParallelServicesConfig({
  serviceTypes,
  center,
}: {
  serviceTypes: SERVICE_TYPE[];
  center?: Center;
}) {
  const [configState, setConfigState] = useState<CenterConfig>();
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (center?.config)
      setConfigState(
        JSON.parse(JSON.stringify(center?.config)) as CenterConfig,
      );
  }, [center]);

  const updateCenterConfig = api.center.updateCenterConfig.useMutation();

  const shouldSave =
    JSON.stringify(center?.config) !== JSON.stringify(configState);

  return (
    <div className="mt-2 rounded-md border p-3">
      <div className="flex flex-col">
        <Label className="text-base">No of Parallel Services:</Label>
        <Label className="text-2sm font-normal text-muted-foreground">
          Number of services that can be booked at the same time for each
          service type.
        </Label>
      </div>

      <div className="mt-4 space-y-2">
        {serviceTypes.map((serviceType) => {
          const noOfParallelServices =
            configState?.services?.[serviceType]?.noOfParallelServices;

          return (
            <div key={serviceType} className="flex items-center gap-3 text-sm">
              <span className="col-span-3 w-36 shrink-0">
                {SERVICES_CONFIG[serviceType]?.name}:{" "}
              </span>
              <Input
                type="number"
                min={1}
                className="col-span-1 w-20 px-1 text-center md:h-8"
                defaultValue={noOfParallelServices}
                value={noOfParallelServices}
                onChange={(e) => {
                  setConfigState((configState) => {
                    if (!configState) {
                      return configState;
                    }

                    configState.services[serviceType]!.noOfParallelServices =
                      parseInt(e.target.value);

                    return { ...configState };
                  });
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          onClick={async () => {
            try {
              setIsSaving(true);
              await updateCenterConfig.mutateAsync({
                centerPublicId: center!.publicId,
                services: configState!.services,
              });
              router.refresh();
            } catch (error) {
              console.error(error);
            }
            setIsSaving(false);
          }}
          disabled={!shouldSave || isSaving}
          className="flex items-center gap-1"
        >
          <span>Save</span>
          {isSaving && <Loader show={true} className="size-5" />}
        </Button>
      </div>
    </div>
  );
}

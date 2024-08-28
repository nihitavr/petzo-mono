"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding");

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
    configState &&
    JSON.stringify(center?.config) !== JSON.stringify(configState);

  if (!serviceTypes.length) return null;

  return (
    <div
      className={`mt-2 rounded-md border p-3 ${isOnboarding ? "border-2 border-primary" : ""}`}
    >
      <div className="flex flex-col">
        <Label className="text-base">No of Parallel Services:</Label>
        <Label
          className={`text-2sm font-normal ${isOnboarding ? "font-semibold text-muted-foreground" : "text-muted-foreground"}`}
        >
          {isOnboarding
            ? "Number of services that can be booked at the same time for each service type. Please update this if you have multiple staff working on the same service type parallely."
            : "Number of services that can be booked at the same time for each service type."}
        </Label>
      </div>
      <div className="mt-4 space-y-2">
        {serviceTypes.map((serviceType) => {
          const noOfParallelServices =
            configState?.services?.[serviceType]?.noOfParallelServices ?? 1;

          return (
            <div key={serviceType} className="flex items-center gap-3 text-sm">
              <span className="w-36">
                {SERVICES_CONFIG[serviceType]?.name}:{" "}
              </span>
              <Input
                type="number"
                min={1}
                className="w-12 px-1 text-center md:h-8"
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
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {(shouldSave || isOnboarding) && (
        <div className="mt-3 flex justify-end">
          <Button
            onClick={async () => {
              try {
                setIsSaving(true);
                await updateCenterConfig.mutateAsync({
                  centerPublicId: center!.publicId,
                  services: configState!.services,
                });

                if (isOnboarding) {
                  router.push(`/dashboard/${center!.publicId}/manage`);
                }

                router.refresh();
              } catch (error) {
                console.error(error);
              }
              setIsSaving(false);
            }}
            disabled={isSaving}
            className="flex items-center gap-1"
          >
            <span>{isOnboarding ? "Finish Onboarding" : "Save"}</span>
            {isSaving && <Loader show={true} className="size-5" />}
          </Button>
        </div>
      )}
    </div>
  );
}

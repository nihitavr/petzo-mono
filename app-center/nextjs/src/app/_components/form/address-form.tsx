"use client";

import type { Marker } from "mapbox-gl";
import type { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signal } from "@preact/signals-react";
import mapboxgl from "mapbox-gl";
import { getPlaceFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { useForm } from "react-hook-form";
import { GrLocation } from "react-icons/gr";
import { MdMyLocation } from "react-icons/md";

import type { CenterAddress, Point } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@petzo/ui/components/form";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";
import Loader from "@petzo/ui/components/loader";
import { fetchLocation } from "@petzo/ui/components/location";
import { toast } from "@petzo/ui/components/toast";
import { centerApp } from "@petzo/validators";

import { env } from "~/env";
import { api } from "~/trpc/react";

const MAP_ZOOM = 16.5;

const GEOLOCATION_CONFIG = {
  maximumAge: 0,
  timeout: 10000,
  nocache: true,
};

type CenterAddressSchema = z.infer<
  typeof centerApp.centerAddress.CenterAddressForm
>;

mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function AddressForm({
  centerPublicId,
  centerAddress,
  isAdmin = false,
}: {
  centerPublicId: string;
  centerAddress?: CenterAddress;
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding");

  const marker = useRef<Marker | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef(null);

  const lng = signal(centerAddress?.geocode?.longitude ?? 77.6288582);
  const lat = signal(centerAddress?.geocode?.latitude ?? 12.9027356);

  const form = useForm({
    resolver: zodResolver(centerApp.centerAddress.CenterAddressForm),
    defaultValues: {
      placeAddressFormatted: getPlaceFormattedAddresses(centerAddress),

      id: centerAddress?.id,
      houseNo: centerAddress?.houseNo ?? "",
      line1: centerAddress?.line1 ?? "",
      line2: centerAddress?.line2 ?? "",
      areaId: centerAddress?.areaId ?? "",
      cityId: centerAddress?.cityId ?? "",
      stateId: centerAddress?.cityId ?? "",
      pincode: centerAddress?.pincode ?? "",
      geocode: centerAddress?.geocode ?? ({} as Point),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const upsertAddress = api.centerAddress.upsertAddress.useMutation();
  const reverseGeocodeMutation = api.map.reverseGeocode.useMutation();

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng.value, lat.value],
      zoom: MAP_ZOOM,
      scrollZoom: true,
    });

    if (!centerAddress && navigator.geolocation) {
      fetchCurrentLocationAndUpdateAddress();
    } else {
      rerenderMap(lng.value, lat.value);
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    map.current?.on("click", async (e) => {
      const { lng: longitude, lat: latitude } = e.lngLat;
      rerenderMap(longitude, latitude, true);
      await updateAddressData({ latitude, longitude });
    });

    map.current?.on("dragstart", (e) => {
      e.originalEvent?.preventDefault();
      e.originalEvent?.stopPropagation();
    });

    map.current?.on("drag", (e) => {
      const { lng: longitude, lat: latitude } = e.target.getCenter();
      rerenderMap(longitude, latitude, false, false);
      e.originalEvent?.preventDefault();
      e.originalEvent?.stopPropagation();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    map.current?.on("dragend", async (e) => {
      const { lng: longitude, lat: latitude } = e.target.getCenter();

      rerenderMap(longitude, latitude, false, true);
      await updateAddressData({ latitude, longitude });
    });
  }, []);

  const fetchCurrentLocationAndUpdateAddress = () => {
    setIsFetchingLocation(true);

    fetchLocation(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (position) => {
        rerenderMap(position.coords.longitude, position.coords.latitude, true);
        await updateAddressData(position.coords);
        setIsFetchingLocation(false);
      },
      () => {
        setIsFetchingLocation(false);
        toast.warning("Unable to retrieve your location");
      },
      GEOLOCATION_CONFIG,
    );
  };

  const updateAddressData = async (geocode: Point) => {
    setIsFetchingLocation(true);

    const addressData = await reverseGeocodeMutation.mutateAsync({
      latitude: geocode.latitude,
      longitude: geocode.longitude,
    });

    if (addressData) {
      form.setValue("placeAddressFormatted", addressData?.placeFormatted);
      form.setValue("line1", addressData.context.line1);
      form.setValue("areaId", addressData.context.area.id);
      form.setValue("cityId", addressData.context.city.id);
      form.setValue("stateId", addressData.context.state.id);
      form.setValue("pincode", addressData.context.pincode.name);
      form.setValue(
        "geocode",
        {
          latitude: geocode.latitude,
          longitude: geocode.longitude,
        },
        {
          shouldDirty: true,
        },
      );
    }

    setIsFetchingLocation(false);
  };

  const rerenderMap = (
    longitude: number,
    latitude: number,
    scrollSmooth = false,
    pinned = true,
  ) => {
    if (scrollSmooth) {
      map.current?.flyTo({
        center: [longitude, latitude],
        zoom:
          map.current?.getZoom() < MAP_ZOOM ? MAP_ZOOM : map.current?.getZoom(),
        speed: 2,
        curve: 1,
        easing: (t) => t,
      });
    }

    if (marker.current) {
      const el = marker.current.getElement();

      el.style.backgroundImage = pinned
        ? "url(/icons/location-pin.svg)"
        : "url(/icons/location-unpinned.svg)";
      el.style.height = pinned ? "52px" : "63px";
      el.style.marginTop = pinned ? "0px" : "4px";

      marker.current?.setLngLat([longitude, latitude]);
    } else {
      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundImage = "url(/icons/location-unpinned.svg)";
      el.style.width = "103px";
      el.style.height = pinned ? "52px" : "64px";

      marker.current = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);
    }

    lat.value = latitude;
    lng.value = longitude;
  };

  const onClickLocateMe = () => {
    if (navigator.geolocation) {
      fetchCurrentLocationAndUpdateAddress();
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const onMutateSuccess = (
    data?: CenterAddress | null,
    message = "Address added successfully!",
  ) => {
    if (!data) {
      toast.error(
        "There was an error updating the data. We are looking into it!",
      );
      return;
    }

    toast.success(message);

    if (isOnboarding) {
      router.push(
        `/dashboard/${centerPublicId}/services/create?onboarding=true`,
      );
    } else {
      router.push(`/dashboard/${centerPublicId}/manage`);
    }
    router.refresh();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    const data = values as unknown as CenterAddressSchema;

    setIsSubmitting(true);

    await upsertAddress.mutateAsync(
      { centerPublicId, ...data },
      {
        onSuccess: (data) => {
          onMutateSuccess(
            data,
            centerAddress
              ? "Address updated successfully!"
              : "Address added successfully!",
          );
        },
      },
    );

    setIsSubmitting(false);
  };

  const getFullAddressFormatted = (
    houseNo: string,
    line2: string,
    placeAddressFormatted: string,
  ) => {
    let fullFormattedAddress = houseNo ? `${houseNo}, ` : "";
    fullFormattedAddress = line2
      ? `${fullFormattedAddress}${line2}, `
      : fullFormattedAddress;
    fullFormattedAddress = `${fullFormattedAddress}${placeAddressFormatted}`;

    return fullFormattedAddress;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col gap-2 pb-16 md:gap-3"
      >
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl font-semibold">Add Address</h1>
        </div>

        {/* Map */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <div
              data-vaul-no-drag
              className="h-[230px] w-full rounded-lg border md:h-[300px]"
              ref={mapContainer}
            />
            <div className="absolute bottom-4 flex w-full justify-center">
              <Button
                className="space-x-1"
                size="sm"
                type="button"
                disabled={isFetchingLocation}
                variant="primary"
                onClick={onClickLocateMe}
              >
                <span>
                  {isFetchingLocation ? "Fetching location..." : "Locate Me"}
                </span>
                <MdMyLocation size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed address message */}
        <div className="rounded-lg border border-primary/60 bg-primary/20 p-1.5 text-xs md:text-sm">
          <span>
            <span className="font-bold">Note:</span> A detailed address will
            help your customer reach your doorstep easily.
          </span>
        </div>

        {/* Only show this to admin */}
        {isAdmin && (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500 p-3">
            <Label className="text-base font-bold">
              Location Info (Only Admins)
            </Label>

            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="geocode.latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="latitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="geocode.longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>

                    <FormControl>
                      <Input type="number" placeholder="longitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              onClick={async () => {
                const latitude = parseFloat(
                  form.getValues("geocode.latitude").toString(),
                );
                const longitude = parseFloat(
                  form.getValues("geocode.longitude").toString(),
                );

                lat.value = latitude;
                lng.value = longitude;

                rerenderMap(longitude, latitude, true);

                await updateAddressData({
                  latitude,
                  longitude,
                });
              }}
              type="button"
            >
              Fetch
            </Button>
          </div>
        )}

        {/* House No */}
        <FormField
          control={form.control}
          name="houseNo"
          render={({ field }) => (
            <FormItem className="relative mt-1 pt-1.5 md:pt-2">
              <FormLabel className="absolute top-0 text-2sm text-foreground/60 md:text-sm">
                {field.value && "House / Flat / Block No"}
              </FormLabel>

              <FormControl>
                <Input
                  className="rounded-none border-0 border-b px-0 shadow-none focus-visible:border-b-primary focus-visible:ring-0"
                  placeholder="House / Flat / Block No"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Line2 */}
        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem className="relative mt-1 pt-1.5 md:pt-2">
              <FormLabel className="absolute top-0 text-2sm text-foreground/60 md:text-sm">
                {field.value && "Appartment / Road / Area"}
              </FormLabel>
              <FormControl>
                <Input
                  className="rounded-none border-0 border-b px-0 shadow-none focus-visible:border-b-primary focus-visible:ring-0"
                  placeholder="Appartment / Road / Area"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={`md:initial fixed bottom-0 left-0 z-50 flex w-full flex-col justify-end bg-background px-3 pb-3 md:static md:px-0`}
        >
          {/* Fetched Location String */}
          <FormField
            control={form.control}
            name="placeAddressFormatted"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="space-x-1 py-1">
                    <GrLocation size={18} className="inline text-primary" />
                    <span className="text-sm font-bold md:text-sm ">
                      {!field.value || isFetchingLocation
                        ? "Fetching address..."
                        : getFullAddressFormatted(
                            form.watch("houseNo"),
                            form.watch("line2"),
                            field.value,
                          )}
                    </span>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Save Button */}

          <div className="flex w-full md:justify-end">
            <div className="flex w-full flex-col items-end">
              {isOnboarding && (
                <Label className="mr-2 text-sm">Next: Add Service</Label>
              )}
              <Button
                className="flex w-full min-w-32 items-center justify-center gap-2 md:w-fit"
                type="submit"
                disabled={
                  Object.keys(form.formState.dirtyFields).length == 0 ||
                  isSubmitting ||
                  isFetchingLocation
                }
              >
                <span>{isOnboarding ? "Save & Continue" : "Save"}</span>
                {isSubmitting && (
                  <div>
                    <Loader className="h-5 w-5 border-2 " show={isSubmitting} />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

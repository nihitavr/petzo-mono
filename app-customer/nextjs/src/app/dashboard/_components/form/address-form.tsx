"use client";

import type { Marker } from "mapbox-gl";
import type { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signal } from "@preact/signals-react";
import mapboxgl from "mapbox-gl";
import { getPlaceFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { useForm } from "react-hook-form";
import { GrLocation } from "react-icons/gr";
import { MdMyLocation } from "react-icons/md";

import type { CustomerAddresses, Point } from "@petzo/db";
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
import { toast } from "@petzo/ui/components/toast";
import { customerAddressValidator } from "@petzo/validators";

import { env } from "~/env";
import { api } from "~/trpc/react";
import FormSaveButton from "../form-save-button";

const zoom = 16.5;

type CustomerAddressSchema = z.infer<
  typeof customerAddressValidator.CustomerAddressForm
>;

mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function AddressForm({
  customerAddresses,
}: {
  customerAddresses?: CustomerAddresses;
}) {
  const router = useRouter();

  const marker = useRef<Marker | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef(null);

  const lng = signal(customerAddresses?.geocode?.longitude ?? 77.6288582);
  const lat = signal(customerAddresses?.geocode?.latitude ?? 12.9027356);

  const form = useForm({
    resolver: zodResolver(customerAddressValidator.CustomerAddressForm),
    defaultValues: {
      placeAddressFormatted: getPlaceFormattedAddresses(customerAddresses),

      id: customerAddresses?.id,
      name: customerAddresses?.name ?? "",
      houseNo: customerAddresses?.houseNo ?? "",
      line1: customerAddresses?.line1 ?? "",
      line2: customerAddresses?.line2 ?? "",
      areaId: customerAddresses?.areaId ?? "",
      cityId: customerAddresses?.cityId ?? "",
      stateId: customerAddresses?.cityId ?? "",
      pincode: customerAddresses?.pincode ?? "",
      geocode: customerAddresses?.geocode ?? {},
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const upsertAddress = api.customerAddress.upsertAddress.useMutation();
  const reverseGeocodeMutation = api.map.reverseGeocode.useMutation();

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng.value, lat.value],
      zoom: zoom,
      scrollZoom: true,
    });

    if (!customerAddresses && navigator.geolocation) {
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

    map.current?.on("drag", (e) => {
      const { lng: longitude, lat: latitude } = e.target.getCenter();
      rerenderMap(longitude, latitude, false, false);
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

    navigator.geolocation.getCurrentPosition(
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
      form.setValue("geocode", geocode, {
        shouldDirty: true,
      });
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
        zoom: map.current?.getZoom() < zoom ? zoom : map.current?.getZoom(),
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
    data?: CustomerAddresses | null,
    message = "Address added successfully!",
  ) => {
    if (!data) {
      toast.error(
        "There was an error updating the data. We are looking into it!",
      );
      return;
    }

    toast.success(message);
    router.push("/dashboard/addresses");
    router.refresh();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    const data = values as unknown as CustomerAddressSchema;

    setIsSubmitting(true);

    await upsertAddress.mutateAsync(data, {
      onSuccess: (data) => {
        onMutateSuccess(
          data?.[0],
          customerAddresses
            ? "Address updated successfully!"
            : "Address added successfully!",
        );
      },
    });

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 md:gap-3"
      >
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl font-semibold">Add Address</h1>
        </div>

        {/* Map */}
        <div className="flex flex-col gap-2">
          <div className="relative">
            <div
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

        {/* Fetched Location String */}
        <FormField
          control={form.control}
          name="placeAddressFormatted"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="line-clamp-2 space-x-1 py-1">
                  <GrLocation size={23} className="inline text-primary" />
                  <span className="text-sm font-semibold md:text-base">
                    {!field.value || isFetchingLocation
                      ? "Fetching address..."
                      : field.value}
                  </span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Detailed address message */}
        <div className="rounded-lg border border-primary/60 bg-primary/20 p-1.5 text-xs md:text-sm">
          <span>
            A detailed address will help our Partner reach your doorstep easily
          </span>
        </div>

        {/* House No */}
        <FormField
          control={form.control}
          name="houseNo"
          render={({ field }) => (
            <FormItem className="relative mt-1 pt-1.5 md:pt-2">
              <FormLabel className="absolute top-0 text-xs text-foreground/60 md:text-sm">
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
              <FormLabel className="absolute top-0 text-xs text-foreground/60 md:text-sm">
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

        {/* Address Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="relative mt-4 pt-3">
              <FormLabel className="absolute top-0 text-foreground/80">
                SAVE AS
              </FormLabel>

              <FormControl>
                <Input
                  className="rounded-none border-0 border-b px-0 shadow-none focus-visible:border-b-primary focus-visible:ring-0"
                  placeholder="Address Name (eg. Home)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Save Button */}
        <FormSaveButton
          disabled={Object.keys(form.formState.dirtyFields).length == 0}
          isSubmitting={isSubmitting || isFetchingLocation}
        />
      </form>
    </Form>
  );
}
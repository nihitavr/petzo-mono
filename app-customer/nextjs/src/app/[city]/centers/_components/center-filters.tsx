"use client";

import type { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";

import { Button } from "@petzo/ui/components/button";
import { Checkbox } from "@petzo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@petzo/ui/components/form";
import Loader from "@petzo/ui/components/loader";
import { fetchLocation } from "@petzo/ui/components/location";
import { cn } from "@petzo/ui/lib/utils";
import { centerValidator } from "@petzo/validators";

import { filtersStore } from "~/lib/storage/global-storage";

type CenterFilterFormSchemaType = z.infer<typeof centerValidator.FormFilters>;

export function CenterFilters({
  className,
  onApply,
  filters,
}: {
  className?: string;
  onApply?: () => void;
  filters: CenterFilterFormSchemaType;
}) {
  useSignals();

  const router = useRouter();

  const form = useForm({
    schema: centerValidator.FormFilters,
    defaultValues: filters,
  });

  const [fetchingLocation, setFetchingLocation] = useState(false);

  const onSubmit = (values: CenterFilterFormSchemaType) => {
    let filterUrl = `/${filtersStore.city.value}/centers`;
    const urlQueryParams = new URLSearchParams();

    const serviceType = values.filters
      .find((filter) => filter.publicId === "serviceType")
      ?.items.filter((item) => item.selected)
      .map((item) => item.publicId)
      .join(",");

    if (serviceType) urlQueryParams.set("serviceType", serviceType);

    const rating = values.filters
      .find((filter) => filter.publicId === "ratingGte")
      ?.items.find((item) => item.selected)?.publicId;

    if (rating) urlQueryParams.set("ratingGte", rating);

    const area = values.filters
      .find((filter) => filter.publicId === "area")
      ?.items.filter((item) => item.selected)
      .map((item) => item.publicId)
      .join(",");

    if (area) urlQueryParams.set("area", area);

    const nearby = values.filters
      .find((filter) => filter.publicId === "distance")
      ?.items.find((item) => item.selected);

    if (nearby) {
      setFetchingLocation(true);
      fetchLocation(
        (position) => {
          urlQueryParams.set("latitude", `${position.coords.latitude}`);
          urlQueryParams.set("longitude", `${position.coords.longitude}`);

          const urlQueryParamsStr = urlQueryParams.toString();
          if (urlQueryParamsStr) filterUrl += `?${urlQueryParamsStr}`;

          if (onApply) onApply();

          setFetchingLocation(false);
          form.reset(values);
          router.push(filterUrl);
          router.refresh();
        },
        () => {
          if (onApply) onApply();
          setFetchingLocation(false);
        },
      );
    } else {
      if (onApply) onApply();

      const urlQueryParamsStr = urlQueryParams.toString();
      if (urlQueryParamsStr) filterUrl += `?${urlQueryParamsStr}`;

      form.reset(values);
      router.push(filterUrl);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("h-full w-full flex-col overflow-hidden", className)}
      >
        <div className="fixed flex h-8 w-full items-center justify-between border-b bg-background px-4 py-6 md:static">
          <h3 className="text-lg font-semibold">Filters</h3>
          {form.formState.isDirty && (
            <Button
              size="sm"
              type="submit"
              className="mr-7 rounded-full md:mr-0"
              disabled={fetchingLocation}
            >
              <span>Apply</span>
              <Loader
                className="ml-1 size-4 border-2"
                show={fetchingLocation}
              />
            </Button>
          )}
        </div>

        <div className="mt-14 md:mt-0" />

        {filters.filters.map((_, filterTypeIdx) => {
          return (
            <div key={`filters.${filterTypeIdx}`}>
              <FormField
                control={form.control}
                name={`filters.${filterTypeIdx}`}
                render={({ field }) => {
                  return (
                    <FormItem className="px-4 py-2">
                      <FormLabel className="font-semibold text-foreground">
                        {field.value.label}
                      </FormLabel>
                      <div className="max-h-72 space-y-2 overflow-auto">
                        {field.value?.items.map((serviceTypeItem, itemIdx) => (
                          <FormField
                            key={`filters.${filterTypeIdx}.items.${itemIdx}`}
                            control={form.control}
                            name={`filters.${filterTypeIdx}.items.${itemIdx}`}
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={`${filterTypeIdx}.items.${itemIdx}.item`}
                                  className="flex flex-row items-center space-x-3 space-y-0 pb-1"
                                >
                                  <FormControl>
                                    <Checkbox
                                      className=""
                                      checked={field.value.selected}
                                      onCheckedChange={(checked) => {
                                        field.onChange({
                                          ...field.value,
                                          selected: checked,
                                        });
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="w-full cursor-pointer text-base font-normal">
                                    {field.value.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {filterTypeIdx < filters.filters.length - 1 && <hr />}
            </div>
          );
        })}
      </form>
    </Form>
  );
}

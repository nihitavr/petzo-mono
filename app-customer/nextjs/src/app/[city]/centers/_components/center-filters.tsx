"use client";

import type { z } from "zod";
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

  const onSubmit = (values: CenterFilterFormSchemaType) => {
    if (onApply) {
      onApply();
    }

    let filterUrl = `/${filtersStore.city.value}/centers`;
    const urlQueryParams = new URLSearchParams();

    const serviceType = values.filters
      .find((filter) => filter.publicId === "serviceType")
      ?.items.filter((item) => item.selected)
      .map((item) => item.publicId)
      .join(",");

    if (serviceType) urlQueryParams.set("serviceType", serviceType);

    const rating = values.filters
      .find((filter) => filter.publicId === "rating")
      ?.items.find((item) => item.selected)?.publicId;

    if (rating) urlQueryParams.set("rating", rating);

    const area = values.filters
      .find((filter) => filter.publicId === "area")
      ?.items.filter((item) => item.selected)
      .map((item) => item.publicId)
      .join(",");

    if (area) urlQueryParams.set("area", area);

    const urlQueryParamsStr = urlQueryParams.toString();

    if (urlQueryParamsStr) filterUrl += `?${urlQueryParamsStr}`;

    form.reset(values);
    router.push(filterUrl);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("h-full w-full flex-col overflow-hidden", className)}
      >
        <div className="flex h-8 items-center justify-between px-4 py-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          {form.formState.isDirty && (
            <Button size="sm" type="submit" className="rounded-full">
              Apply
            </Button>
          )}
        </div>

        <hr />

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

import { forwardRef } from "react";

import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="container-2">
      <div className="hidden items-center justify-end gap-2 md:flex">
        <Skeleton className="h-8 w-full rounded-full md:w-36" />
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Filters */}
        <div className="hidden h-min sm:col-span-3 sm:inline md:inline">
          <LoadingCenterFilters />
        </div>

        <div className="col-span-12 flex w-full gap-2 md:hidden">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>

        {/* Centers List */}
        <div className="col-span-12 sm:col-span-9">
          <LoadingCentersList />
        </div>
      </div>
    </div>
  );
}

export const LoadingCentersList = forwardRef<
  HTMLDivElement,
  {
    noOfItems?: number;
  }
>(({ noOfItems = 3 }, ref) => {
  const arr = Array.from({ length: noOfItems });

  return (
    <div ref={ref} className="flex w-full flex-col gap-3">
      {arr.map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="flex h-44 rounded-lg md:h-60"
        >
          <Skeleton className="h-full w-2/5 rounded-lg bg-muted-foreground/15" />
          <div className="flex w-3/5 flex-col gap-1 p-2">
            <Skeleton className="h-6 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
            <Skeleton className="mt-auto h-12 w-full rounded-r-full bg-muted-foreground/15 bg-gradient-to-r from-muted/10" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
});

LoadingCentersList.displayName = "LoadingCentersList";

export function LoadingCenterFilters() {
  return (
    <Skeleton className="flex w-full flex-col gap-3 rounded-full p-3 md:h-[50vh] md:rounded-lg">
      <Skeleton className="h-6 w-1/2 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />

      <Skeleton className="mt-2 h-6 w-1/2 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />

      <Skeleton className="mt-2 h-6 w-1/2 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
      <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
    </Skeleton>
  );
}

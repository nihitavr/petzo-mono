import { forwardRef } from "react";

import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-3 md:mt-4">
      <div className="flex w-full items-center justify-between gap-2">
        <Skeleton className="h-6 w-32 rounded-full md:w-36" />
        <Skeleton className="h-8 w-28 rounded-full md:w-32" />
      </div>
      <div className="grid grid-cols-12 gap-3">
        {/* Filters */}

        {/* Centers List */}
        <div className="col-span-12 sm:col-span-9">
          <LoadingPetsList />
        </div>
      </div>
    </div>
  );
}

export const LoadingPetsList = forwardRef<
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
          className="flex h-28 w-full rounded-lg md:h-40"
        >
          <Skeleton className="aspect-square h-full rounded-lg bg-muted-foreground/15" />
          <div className="flex w-3/5 flex-col gap-1 p-2">
            <Skeleton className="h-6 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
});

LoadingPetsList.displayName = "LoadingCentersList";

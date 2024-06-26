import { forwardRef } from "react";

import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex w-full items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Your Pets</h1>
        <Skeleton className="h-9 w-24 rounded-full md:w-28" />
      </div>
      <LoadingPetsList />
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
    <div ref={ref} className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {arr.map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="flex h-full min-h-28 w-full min-w-28 rounded-lg"
        >
          <Skeleton className="aspect-square h-full rounded-lg bg-muted-foreground/15" />
          <div className="flex w-full flex-col gap-1 p-2">
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-3 w-3/4 rounded-md bg-muted-foreground/15" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
});

LoadingPetsList.displayName = "LoadingCentersList";

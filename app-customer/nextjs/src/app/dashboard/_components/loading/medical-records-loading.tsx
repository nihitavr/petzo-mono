import { forwardRef } from "react";

import { Skeleton } from "@petzo/ui/components/skeleton";

export const MedicalRecordsListLoading = forwardRef<
  HTMLDivElement,
  {
    noOfItems?: number;
  }
>(({ noOfItems = 3 }, ref) => {
  const arr = Array.from({ length: noOfItems });

  return (
    <div ref={ref} className="grid grid-cols-1 gap-2">
      {arr.map((_, index) => (
        <Skeleton
          key={`skeleton-${index}`}
          className="flex h-14 w-full items-center justify-between rounded-lg p-2 md:h-[3.8rem]"
        >
          <Skeleton className="h-5 w-2/5 rounded-lg bg-muted-foreground/15 md:w-1/5" />
          <Skeleton className="size-3 rounded-full bg-muted-foreground/15" />
        </Skeleton>
      ))}
    </div>
  );
});

MedicalRecordsListLoading.displayName = "LoadingCentersList";

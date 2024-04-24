import { Skeleton } from "@petzo/ui/components/skeleton";

import { MedicalRecordsListLoading } from "../_components/loading/medical-records-loading";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Medical Records</h1>
      <div className="flex gap-3">
        <Skeleton className="flex h-28 w-24 justify-center py-2 md:h-36 md:w-32">
          <Skeleton className="size-20 rounded-full bg-foreground/10 md:size-28" />
        </Skeleton>

        <Skeleton className="mt-2 size-20 rounded-full md:size-28" />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
        <MedicalRecordsListLoading noOfItems={3} />;
      </div>
    </div>
  );
}

import { Label } from "@petzo/ui/components/label";
import { Skeleton } from "@petzo/ui/components/skeleton";

export default async function Loading() {
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-lg font-semibold">Manage Center</h1>
      <div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-10 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
      <div className="mt-2">
        <Label className="text-base">Center Details</Label>
        <div className="mt-2 flex flex-col gap-4 rounded-lg border p-2">
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-1/3 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </div>
    </div>
  );
}

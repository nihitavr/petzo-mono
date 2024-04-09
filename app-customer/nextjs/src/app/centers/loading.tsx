import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <Skeleton className="h-10 w-52 rounded-lg" />
      </div>
      <div className="grid grid-cols-12 gap-3">
        {/* Filters */}
        <div className="col-span-12 h-min sm:col-span-3 sm:inline">
          <LoadingCenterFilters />
        </div>

        {/* Centers List */}
        <div className="col-span-12 sm:col-span-9">
          <LoadingCentersList />
        </div>
      </div>
    </div>
  );
}

export function LoadingCentersList() {
  const arr = Array.from({ length: 3 });

  return (
    <div className="flex w-full flex-col gap-3">
      {arr.map((_, index) => (
        <Skeleton key={index} className="flex h-44 rounded-lg md:h-60">
          <Skeleton className="h-full w-2/5 rounded-lg bg-muted-foreground/15" />
          <div className="flex w-3/5 flex-col gap-1 p-3">
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-muted-foreground/15" />
            <Skeleton className="h-4 w-1/2 rounded-md bg-muted-foreground/15" />
            <Skeleton className="mt-auto h-4 w-3/4 rounded-md bg-muted-foreground/15" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
}

export function LoadingCenterFilters() {
  return <Skeleton className="h-10 w-full md:h-96" />;
}

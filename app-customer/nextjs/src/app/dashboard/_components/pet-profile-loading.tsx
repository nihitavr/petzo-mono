import { Skeleton } from "@petzo/ui/components/skeleton";

export default function PetProfileLoading() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-5 w-1/2 rounded-lg bg-slate-200" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-32 flex-shrink rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32 flex-shrink rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32 flex-shrink rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32 flex-shrink rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32 flex-shrink rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-32 flex-shrink rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>

      <div
        className={`md:initial fixed bottom-0 left-0 z-50 flex w-full justify-end px-3 py-3 md:static`}
      >
        {" "}
        <Skeleton className="h-10 w-full rounded-full bg-slate-200 md:w-32" />
      </div>
    </div>
  );
}

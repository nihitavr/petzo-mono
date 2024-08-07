import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div>
      <div className="flex w-full items-center justify-between gap-4 font-semibold">
        <h1 className="text-xl">Edit Center</h1>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        <Skeleton className="h-[230px] w-full rounded-lg md:h-[300px]" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-3/5 rounded-lg" />
          <Skeleton className="h-5 w-4/5 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-24 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      <div
        className={`md:initial fixed bottom-0 left-0 z-50 flex w-full justify-end px-3 py-3 md:static md:px-0`}
      >
        {" "}
        <Skeleton className="h-10 w-full rounded-full bg-foreground/20 md:w-32" />
      </div>
    </div>
  );
}

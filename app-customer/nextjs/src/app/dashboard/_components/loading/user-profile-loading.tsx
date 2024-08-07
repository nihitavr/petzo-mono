import { Skeleton } from "@petzo/ui/components/skeleton";

export default function UserProfileLoading() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold">Owner Profile</h1>

      {/* <Skeleton className="h-[25px] w-1/3 rounded-lg bg-slate-200" /> */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[20px] w-32 flex-shrink rounded-md" />
        <Skeleton className="h-[35px] w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[20px] w-32 flex-shrink rounded-md" />
        <Skeleton className="h-[35px] w-full rounded-md" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[20px] w-32 flex-shrink rounded-md" />
        <Skeleton className="h-[35px] w-full rounded-md" />
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

import { Skeleton } from "@petzo/ui/components/skeleton";

export default function UserProfileLoading() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-[25px] w-1/3 rounded-lg bg-slate-200" />
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

      <div className="flex h-full flex-col items-end justify-end">
        <Skeleton className="h-10 w-full rounded-full bg-slate-200 md:w-32" />
      </div>
    </div>
  );
}

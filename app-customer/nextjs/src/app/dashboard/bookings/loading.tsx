import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-semibold">Your Bookings</h1>

      <div className="flex flex-col">
        <hr className="mb-3 mt-1 border-[1px] border-foreground/50" />
        <Skeleton className="h-32 w-full rounded-none" />
        <hr className="my-3 border-[1px] border-foreground/50" />
        <Skeleton className="h-32 w-full rounded-none" />
        <hr className="my-3 border-[1px] border-foreground/50" />
        <Skeleton className="h-32 w-full rounded-none" />
        <hr className="my-3 border-[1px] border-foreground/50" />
        <Skeleton className="h-32 w-full rounded-none" />
      </div>
    </div>
  );
}

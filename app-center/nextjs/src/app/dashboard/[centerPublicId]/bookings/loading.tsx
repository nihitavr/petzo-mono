import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-5 w-2/3 rounded-full" />
      <BookingLoadingCard />
      <div></div>
      <BookingLoadingCard />
    </div>
  );
}

const BookingLoadingCard = () => {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-md border">
      <Skeleton className="h-9 w-full rounded-none rounded-t-md" />

      <div className="flex w-full flex-col gap-1 p-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-24 w-full rounded-md" />

        <Skeleton className="mt-3 h-5 w-24 rounded-full" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    </div>
  );
};

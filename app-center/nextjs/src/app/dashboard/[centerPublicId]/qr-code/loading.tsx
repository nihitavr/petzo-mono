import { Skeleton } from "@petzo/ui/components/skeleton";

export default async function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-3">
      <h3 className="text-center text-2xl">Thank you for reviewing us!</h3>{" "}
      <Skeleton className="size-80" />
      <Skeleton className="h-5 w-80 rounded-full" />
    </div>
  );
}

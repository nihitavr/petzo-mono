import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 p-3 md:animate-none md:flex-row md:px-6 md:py-10">
      <div className="flex h-full w-full flex-col gap-2 md:w-1/2">
        <Skeleton className="aspect-square w-full rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="hidden aspect-square basis-1/4 rounded-md md:inline md:basis-1/5" />
          <Skeleton className="aspect-square basis-1/6 rounded-md" />
          <Skeleton className="aspect-square basis-1/6 rounded-md" />
          <Skeleton className="aspect-square basis-1/6 rounded-md" />
          <Skeleton className="aspect-square basis-1/6 rounded-md" />
          <Skeleton className="aspect-square basis-1/6 rounded-md" />
          <Skeleton className="aspect-square basis-1/6 rounded-md" />
        </div>
      </div>
      <Skeleton className="flex h-full w-full flex-col gap-2 bg-primary/5 p-2">
        <Skeleton className="mt-2 h-8 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="mt-2 h-8 w-1/3 rounded-md" />
        <Skeleton className="mt-2 h-10 w-full rounded-md md:w-32" />
      </Skeleton>
    </div>
  );
}

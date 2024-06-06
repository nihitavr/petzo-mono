import { Skeleton } from "@petzo/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-10 gap-2 md:animate-none">
      <div className="col-span-10 flex h-full w-full flex-col gap-2 md:col-span-4 ">
        <Skeleton className="aspect-square w-full rounded-xl bg-foreground/10" />
        <div className="flex gap-2 ">
          <Skeleton className="hidden aspect-square basis-1/4 rounded-md md:inline md:basis-1/5" />
          <Skeleton className="aspect-square basis-1/6 rounded-md bg-foreground/10" />
          <Skeleton className="aspect-square basis-1/6 rounded-md bg-foreground/10" />
          <Skeleton className="aspect-square basis-1/6 rounded-md bg-foreground/10" />
          <Skeleton className="aspect-square basis-1/6 rounded-md bg-foreground/10" />
          <Skeleton className="aspect-square basis-1/6 rounded-md bg-foreground/10" />
          <Skeleton className="aspect-square basis-1/6 rounded-md bg-foreground/10" />
        </div>
      </div>
      <Skeleton className="col-span-10 flex h-full w-full flex-col gap-2 bg-foreground/10 p-2 md:col-span-6">
        <Skeleton className="mt-2 h-8 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="h-5 w-full rounded-md" />
        <Skeleton className="mt-2 h-8 w-1/3 rounded-md" />
        <Skeleton className="mt-2 h-10 w-full rounded-full md:w-32" />
      </Skeleton>
    </div>
  );
}

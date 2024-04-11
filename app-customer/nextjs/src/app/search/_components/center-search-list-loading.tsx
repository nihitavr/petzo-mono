import { Skeleton } from "@petzo/ui/components/skeleton";

export function CenterSearchListLoading() {
  const arr = Array.from({ length: 4 });

  return (
    <>
      {arr.map((_, index) => (
        <Skeleton key={index} className="flex gap-2">
          <Skeleton className="aspect-square size-28 bg-muted-foreground/15 md:size-32" />
          <div className="flex w-full flex-col gap-3 p-2">
            <Skeleton className="h-4 w-40 bg-muted-foreground/15" />
            <Skeleton className="h-3 w-16 bg-muted-foreground/15" />
            <Skeleton className="h-3 w-28 bg-muted-foreground/15" />
            <Skeleton className="h-3 w-36 bg-muted-foreground/15" />
          </div>
        </Skeleton>
      ))}
    </>
  );
}

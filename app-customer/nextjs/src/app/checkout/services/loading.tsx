import { Button } from "@petzo/ui/components/button";
import { Label } from "@petzo/ui/components/label";
import { Skeleton } from "@petzo/ui/components/skeleton";

export default function ServicesCheckoutLoading() {
  return (
    <div className="flex flex-col gap-5 pb-2">
      <div>
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-xl font-semibold">Cart</h1>
        </div>
        <Skeleton className="h-44 rounded-xl px-2 py-4 pt-10">
          <Skeleton className="h-full rounded-xl bg-background" />
        </Skeleton>
      </div>

      <div>
        <Label className="font-semibold">Bill Details</Label>
        <Skeleton className="flex flex-col gap-3 rounded-xl px-2 py-4">
          <Skeleton className="h-5 rounded-xl bg-foreground/5" />
          <Skeleton className="h-5 rounded-xl bg-foreground/5" />
        </Skeleton>
      </div>

      <div>
        <Label className="font-semibold">Address Details</Label>
        <Skeleton className="h-32 rounded-xl">
          <Skeleton className="h-10 rounded-xl bg-foreground/5 px-2 py-4" />
        </Skeleton>
      </div>

      <div className="fixed bottom-0 left-0 z-10 w-full bg-background px-3 pt-0 md:left-auto md:right-3 md:w-72 md:px-0 lg:right-24 xl:right-48">
        <Button
          disabled={true}
          className="flex h-11 w-full -translate-y-[40%] rounded-xl bg-green-700 caret-primary shadow-[0_0px_20px_rgba(0,0,0,0.25)] shadow-green-700/50 hover:bg-green-700/90"
        >
          <span className="font-semibold">Book Services</span>
        </Button>
      </div>
    </div>
  );
}

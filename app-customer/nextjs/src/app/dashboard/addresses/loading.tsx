import { Skeleton } from "@petzo/ui/components/skeleton";

import AddNewAddressesButton from "../_components/add-new-addresses-button";

export default function AddressesLoading() {
  return (
    <div>
      {/* Your Pets */}
      <div className="flex w-full items-center justify-between gap-4 font-semibold">
        <h1 className="text-xl">Addresses</h1>
        <AddNewAddressesButton />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2 border-b py-6">
          <div className="flex justify-between ">
            <Skeleton className="h-5 w-24 rounded-full bg-foreground/10" />
            <Skeleton className="h-5 w-10  rounded-full" />
          </div>
          <Skeleton className="h-4 w-4/5 rounded-full" />
          <Skeleton className="h-4 w-3/5 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 border-b py-4">
          <div className="flex justify-between ">
            <Skeleton className="h-5 w-24 rounded-full bg-foreground/10" />
            <Skeleton className="h-5 w-10  rounded-full" />
          </div>
          <Skeleton className="h-4 w-4/5 rounded-full" />
          <Skeleton className="h-4 w-3/5 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 border-b py-4">
          <div className="flex justify-between ">
            <Skeleton className="h-5 w-24 rounded-full bg-foreground/10" />
            <Skeleton className="h-5 w-10  rounded-full" />
          </div>
          <Skeleton className="h-4 w-4/5 rounded-full" />
          <Skeleton className="h-4 w-3/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

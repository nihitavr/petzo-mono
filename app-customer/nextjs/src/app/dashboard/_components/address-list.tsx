import Link from "next/link";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";

import type { CustomerAddresses } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";

export default async function AddressesList({
  addresses: addresses,
}: {
  addresses: CustomerAddresses[];
}) {
  return (
    <div className="mt-4 flex flex-col">
      {addresses.map((address, idx) => {
        return (
          <div key={idx} className="flex w-full flex-col gap-1 border-b py-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{address.name}</h3>
              <div>
                <Link href={`/dashboard/addresses/${address.id}`}>
                  <Button variant="outline" size="sm" className="h-6">
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-sm text-foreground/70">
              {getFullFormattedAddresses(address)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

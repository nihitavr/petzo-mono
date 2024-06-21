import Link from "next/link";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { FiPhone } from "react-icons/fi";

import type { CustomerAddresses } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";

import DeleteAddressButton from "./delete-address-button";

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
              <div className="flex items-center gap-2">
                <DeleteAddressButton addressId={address.id} />
                <Link href={`/dashboard/addresses/${address.id}`}>
                  <Button variant="outline" size="sm" className="h-6 ">
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
            <p className="text-sm text-foreground/70">
              {getFullFormattedAddresses(address)}
            </p>
            <div className="flex items-center gap-1 text-foreground/80">
              <FiPhone />
              <p className="text-sm font-semibold">{address.phoneNumber}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

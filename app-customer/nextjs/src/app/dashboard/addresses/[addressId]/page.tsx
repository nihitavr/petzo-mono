import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";
import { AddressForm } from "../../_components/form/address-form";

export default async function AddAddressPage({
  params: { addressId },
}: {
  params: { addressId: string };
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view
              Addresses
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }
  const address = await api.customerAddress.getAddress({ id: +addressId });
  return <AddressForm customerAddresses={address} />;
}

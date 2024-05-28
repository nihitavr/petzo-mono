import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";
import AddNewAddressesButton from "../_components/add-new-addresses-button";
import AddressesList from "../_components/address-list";
import NoAddressesFallback from "../_components/no-addresses-fallback";

export default async function UserProfile() {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view your
              Addresses.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const addresses = await api.customerAddress.getAddresses();

  return (
    <div>
      {/* Your Pets */}
      <div className="flex w-full items-center justify-start gap-4 font-semibold">
        <h1 className="text-xl">Addresses</h1>
        {addresses.length > 0 && (
          <div className="flex-grow">
            <AddNewAddressesButton className="float-right" />
          </div>
        )}
      </div>
      {/* Addresses List */}
      {addresses?.length ? (
        <AddressesList addresses={addresses} />
      ) : (
        <NoAddressesFallback />
      )}
    </div>
  );
}

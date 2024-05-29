import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { AddressForm } from "../../_components/form/address-form";

export default async function AddAddressPage() {
  // sleep 10 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to add new
              Address.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  return <AddressForm />;
}

import { auth } from "@petzo/auth-center-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import { AddressForm } from "~/app/_components/form/address-form";
import SignIn from "~/app/_components/sign-in";

export default async function AddAddressPage({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  const user = (await auth())?.user;

  if (!user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to create
              Address.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  return (
    <AddressForm
      centerPublicId={centerPublicId}
      isAdmin={user.role === "admin"}
    />
  );
}

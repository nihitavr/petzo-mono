import { auth } from "@petzo/auth-center-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import { AddressForm } from "~/app/_components/form/address-form";
import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";

export default async function EditAddressPage({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to edit
              center address.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const centerAddress = await api.centerAddress.getAddress({ centerPublicId });

  return (
    <AddressForm
      centerAddress={centerAddress!}
      centerPublicId={centerPublicId}
    />
  );
}

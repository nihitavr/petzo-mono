import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { PetProfileForm } from "../../_components/pet-profile-form";

export default async function Page() {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view Your
              Pets
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  return <PetProfileForm />;
}

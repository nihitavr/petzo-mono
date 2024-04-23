import { auth } from "@petzo/auth-customer-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { UserProfileForm } from "../_components/form/user-profile-form";

export default async function UserProfile() {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view Your
              Profile.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }
  return <UserProfileForm />;
}

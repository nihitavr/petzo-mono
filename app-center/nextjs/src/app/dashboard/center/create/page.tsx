import { auth } from "@petzo/auth-center-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import { CenterForm } from "~/app/_components/form/center-form";
import SignIn from "~/app/_components/sign-in";

export default async function Page() {
  const user = (await auth())?.user;

  if (!user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to create a
              new service.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  return <CenterForm isAdmin={user.role === "admin"} />;
}

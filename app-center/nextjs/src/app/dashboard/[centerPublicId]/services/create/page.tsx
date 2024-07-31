import { auth } from "@petzo/auth-center-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { ServiceForm } from "~/app/dashboard/_components/service-form";

export default async function Page({
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
              Please <span className="font-semibold">Sign In</span> to create a
              new service.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  return <ServiceForm centerPublicId={centerPublicId} />;
}

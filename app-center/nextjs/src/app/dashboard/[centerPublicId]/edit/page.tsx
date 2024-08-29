import { auth } from "@petzo/auth-center-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import { CenterForm } from "~/app/_components/form/center-form";
import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";

export default async function Page({
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
              Please <span className="font-semibold">Sign In</span> to edit
              center.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const center = await api.center.getCenter({ centerPublicId });

  return <CenterForm center={center} isAdmin={user.role === "admin"} />;
}

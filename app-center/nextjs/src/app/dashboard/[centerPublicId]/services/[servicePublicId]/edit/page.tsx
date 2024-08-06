import { auth } from "@petzo/auth-center-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import { ServiceForm } from "~/app/_components/form/service-form";
import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";

export default async function Page({
  params: { centerPublicId, servicePublicId },
}: {
  params: { centerPublicId: string; servicePublicId: string };
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to edit the
              Service.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const service = await api.service.getService({
    centerPublicId,
    servicePublicId,
  });

  return <ServiceForm centerPublicId={centerPublicId} service={service} />;
}

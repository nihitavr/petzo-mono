import Unauthorised from "@petzo/ui/components/errors/unauthorised";
import { centerUtils } from "@petzo/utils";

import { env } from "~/env";
import { api } from "~/trpc/server";
import QrCodeComponent from "../../_components/qrcode";

export default async function Page({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  const center = await api.center.getCenter({ centerPublicId });

  if (!center) {
    return (
      <Unauthorised>
        <span className="text-base">
          Center does not exist or you do not have access to it.
        </span>
      </Unauthorised>
    );
  }

  const centerUrl = `${centerUtils.getCenterUrl(center, env.CUSTOMER_APP_BASE_URL)}#reviews`;

  return (
    <div className="flex h-[80vh] flex-col justify-center">
      <div className="relative rounded-xl border-2 border-primary p-5">
        <div className="absolute left-1/2 top-0 w-min -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-2 py-1 text-xl font-medium text-primary-foreground">
          Scan Me
        </div>
        <h3 className="mb-3 mt-2 text-center text-xl">
          Thank you for reviewing us!
        </h3>
        <QrCodeComponent data={centerUrl} />
      </div>
      <h4 className="mt-1 text-center text-2xl font-medium">{center.name}</h4>
    </div>
  );
}

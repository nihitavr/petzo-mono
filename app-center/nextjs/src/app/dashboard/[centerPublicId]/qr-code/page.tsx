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

  return <QrCodeComponent data={centerUrl} />;
}

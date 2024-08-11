import Link from "next/link";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { FaQrcode } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

import { auth } from "@petzo/auth-center-app";
import { CENTER_STATUS_CONFIG } from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";
import { Label } from "@petzo/ui/components/label";
import { centerUtils, getGoogleLocationLink } from "@petzo/utils";

import SignIn from "~/app/_components/sign-in";
import { env } from "~/env";
import { api } from "~/trpc/server";

export default async function Page({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised>
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-base">
            Please <span className="font-semibold">Sign In</span> to manage your
            center.
          </span>
          <SignIn />
        </div>
      </Unauthorised>
    );
  }

  const [center, services] = await Promise.all([
    api.center.getCenter({ centerPublicId }),
    api.service.getServices({ centerPublicId }),
  ]);

  if (!center) {
    return (
      <Unauthorised>
        <span className="text-base">
          Center does not exist or you do not have access to it.
        </span>
      </Unauthorised>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="text-lg font-semibold">Manage Center</h1>
      <div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/${centerPublicId}/edit`}
            className="flex w-full items-center justify-center rounded-lg font-semibold hover:bg-muted"
          >
            <Button className="w-full" variant="primary">
              Edit Details
            </Button>
          </Link>
          <Link
            href={`/dashboard/${centerPublicId}/address/edit`}
            className="flex w-full items-center justify-center rounded-lg font-semibold hover:bg-muted"
          >
            <Button className="w-full" variant="primary">
              Edit Address
            </Button>
          </Link>
        </div>
        <div className="mt-3 flex gap-2 ">
          <a
            href={centerUtils.getCenterUrl(center, env.CUSTOMER_APP_BASE_URL)}
            className="flex w-full items-center justify-center rounded-lg font-semibold hover:bg-muted"
            target="_blank"
            rel="noreferrer"
          >
            <Button className="w-full" variant="outline">
              <span>Preview Center</span>
              <FiArrowUpRight className="inline" size={18} />
            </Button>
          </a>
          <Link
            href={`/dashboard/${centerPublicId}/qr-code`}
            className="flex w-full items-center justify-center rounded-lg font-semibold hover:bg-muted"
          >
            <Button className="w-full" variant="outline">
              <span>Center Qr Code</span>
              <FaQrcode className="ml-1 inline" size={15} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="mt-2">
        <Label className="text-base">Center Details</Label>
        <div className="flex flex-col gap-2 rounded-lg border p-2">
          <CenterDetailsItem label="Center Name" text={center?.name} />
          <CenterDetailsItem
            label={
              services.length
                ? `Services (Total: ${services.length})`
                : "Services"
            }
            text={centerUtils.getServiceTypeNamesStr(services)}
          />
          <CenterDetailsItem
            label="Address"
            text={getFullFormattedAddresses(center?.centerAddress)}
          />
          <CenterDetailsItem label="Map Location">
            {!!center?.centerAddress?.geocode && (
              <a
                href={getGoogleLocationLink(center?.centerAddress?.geocode)}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer text-sm font-medium text-blue-800 hover:underline dark:text-blue-500 md:text-base"
              >
                <span>Open in Google Maps</span>
                <FiArrowUpRight className="inline" size={18} />
              </a>
            )}
          </CenterDetailsItem>

          <div>
            <CenterDetailsItem label="Verification Status">
              <span
                style={{
                  backgroundColor: CENTER_STATUS_CONFIG[center.status].bgColor,
                  color: CENTER_STATUS_CONFIG[center.status].textColor,
                }}
                className="cursor-pointer rounded-md p-1 text-2sm font-medium hover:underline md:text-sm"
              >
                {CENTER_STATUS_CONFIG[center.status].name}
              </span>
            </CenterDetailsItem>
            {center.status === "created" && (
              <div className="mt-0.5 text-xs text-destructive md:text-2sm">
                Your center is not yet verified. Please wait for the
                verification process to complete.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const CenterDetailsItem = ({
  label,
  text,
  children,
}: {
  label: string;
  text?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div>
      <span className="text-sm font-medium opacity-70 md:text-base">
        {label}:{" "}
      </span>
      {!!text && (
        <span className="text-sm font-medium md:text-base">{text}</span>
      )}
      {!!children && children}
      {!text && !children && (
        <span className="text-sm font-medium text-destructive md:text-base">
          Not yet added
        </span>
      )}
    </div>
  );
};

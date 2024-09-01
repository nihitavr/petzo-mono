import Link from "next/link";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { FaQrcode } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

import { auth } from "@petzo/auth-center-app";
import {
  CENTER_CTA_BUTTONS_CONFIG,
  CENTER_FEATURES_CONFIG,
  CENTER_STATUS_CONFIG,
  INDIA_COUNTRY_CODE,
  PET_TYPE_CONFIG,
  SERVICES_CONFIG,
  WHATSAPP_URL,
} from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";
import { Label } from "@petzo/ui/components/label";
import { centerUtils, getGoogleLocationLink, timeUtils } from "@petzo/utils";

import SignIn from "~/app/_components/sign-in";
import { env } from "~/env";
import { api } from "~/trpc/server";
import AdminVerifyCenter from "../../_components/admin-verify-center";

export default async function Page({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  const user = (await auth())?.user;

  if (!user) {
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
            <Button className="w-full text-2sm md:text-sm" variant="primary">
              Edit Details
            </Button>
          </Link>
          <Link
            href={`/dashboard/${centerPublicId}/address/edit`}
            className="flex w-full items-center justify-center rounded-lg font-semibold hover:bg-muted"
          >
            <Button className="w-full text-2sm md:text-sm" variant="primary">
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
            <Button className="w-full text-2sm md:text-sm" variant="outline">
              <span>Preview Center</span>
              <FiArrowUpRight className="inline" size={18} />
            </Button>
          </a>
          <Link
            href={`/dashboard/${centerPublicId}/qr-code`}
            className="flex w-full items-center justify-center rounded-lg font-semibold hover:bg-muted"
          >
            <Button className="w-full text-2sm md:text-sm" variant="outline">
              <span>Center QrCode</span>
              <FaQrcode className="ml-1 inline" size={15} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-2">
        <Label className="text-base">Center Summary</Label>
        <div className="flex flex-col gap-2 rounded-lg border p-2 text-sm md:text-base">
          <CenterDetailsItem label="Center Name">
            <Link
              href={`/dashboard/${center.publicId}/edit`}
              className="font-medium hover:underline"
            >
              {center.name}
            </Link>
          </CenterDetailsItem>
          {user.role == "admin" && (
            <CenterDetailsItem label="Google Rating">
              <span className="font-medium text-yellow-700">
                {`${center.googleRating} (${center.googleRatingCount})` ||
                  "Not yet rated"}
              </span>
            </CenterDetailsItem>
          )}
          <CenterDetailsItem label="Phone Number">
            <>
              <span className="font-medium">{center.phoneNumber} </span>
              <a
                href={`${WHATSAPP_URL}/${INDIA_COUNTRY_CODE}${center.phoneNumber}?text=Hi, I found your number from Furclub. I want to know more about the services you offer.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline items-center gap-1 hover:underline"
              >
                (WhatsApp)
              </a>
            </>
          </CenterDetailsItem>
          <CenterDetailsItem label="Timings">
            <span className="font-medium">
              {timeUtils.getTimings(center.operatingHours)}
            </span>
          </CenterDetailsItem>

          <div>
            <CenterDetailsItem label="Verification Status">
              <span
                style={{
                  backgroundColor: CENTER_STATUS_CONFIG[center.status].bgColor,
                  color: CENTER_STATUS_CONFIG[center.status].textColor,
                }}
                className="rounded-md p-1 text-2sm font-medium md:text-sm"
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

          <CenterDetailsItem label={"Services Types"}>
            <span className="font-medium text-primary">
              {centerUtils.getServiceTypeNamesStr(services)}
            </span>
          </CenterDetailsItem>

          <CenterDetailsItem label={"Center Features"}>
            {!!center.features?.length && (
              <span className="font-medium text-purple-600">
                {center.features
                  ?.map((feature) => CENTER_FEATURES_CONFIG[feature].name)
                  .join(", ")}
              </span>
            )}
          </CenterDetailsItem>

          <CenterDetailsItem label={"CTA Buttons"}>
            {!!center.ctaButtons?.length && (
              <span className="font-medium">
                {center.ctaButtons
                  ?.map((feature) => CENTER_CTA_BUTTONS_CONFIG[feature].name)
                  .join(", ")}
              </span>
            )}
          </CenterDetailsItem>

          <CenterDetailsItem
            label={
              services.length
                ? `Services (Total: ${services.length})`
                : "Services"
            }
          >
            <ol className="ml-3 grid list-inside list-decimal text-sm md:grid-cols-2 md:text-base">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="cursor-pointer text-sm hover:underline"
                >
                  <Link
                    href={`/dashboard/${center.publicId}/services/${service.publicId}/edit`}
                  >
                    <span className="font-medium">{service.name}</span>
                    <ul className="ml-6 list-disc">
                      <li>
                        <span className="font-medium opacity-60">
                          ServiceType:{" "}
                        </span>
                        <span className="font-medium text-primary">
                          {SERVICES_CONFIG[service.serviceType]?.name}
                        </span>
                      </li>

                      <li>
                        <span className="font-medium opacity-60">Price: </span>
                        <span className="font-medium text-green-600">
                          ₹ {service.price}
                        </span>
                      </li>
                      <li>
                        <span className="font-medium opacity-60">
                          Pet Types:{" "}
                        </span>
                        <span className="font-medium">
                          {service.petTypes
                            ?.map((petType) => PET_TYPE_CONFIG[petType].name)
                            .join(", ")}
                        </span>
                      </li>
                      <li>
                        <span className="font-medium opacity-60">
                          Booking:{" "}
                        </span>
                        {service.isBookingEnabled ? (
                          <span className="font-medium text-green-600">
                            Enabled
                          </span>
                        ) : (
                          <span className="font-medium text-red-600">
                            Disabled
                          </span>
                        )}
                      </li>
                      <li>
                        <span className="font-medium opacity-60">
                          Total Images:{" "}
                        </span>
                        <span className="font-semibold">
                          {service.images?.length}
                        </span>
                      </li>
                    </ul>
                  </Link>
                </li>
              ))}
            </ol>
          </CenterDetailsItem>
          <CenterDetailsItem label="Address">
            <Link
              href={`/dashboard/${center.publicId}/address/edit`}
              className="text-sm hover:underline md:text-base"
            >
              {getFullFormattedAddresses(center?.centerAddress)}
            </Link>
          </CenterDetailsItem>
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
        </div>
      </div>

      {user.role == "admin" && (
        <AdminVerifyCenter
          centerPublicId={center.publicId}
          verified={center.status === "verified"}
        />
      )}
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

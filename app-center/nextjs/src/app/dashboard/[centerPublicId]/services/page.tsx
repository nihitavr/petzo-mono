import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { LuPencil } from "react-icons/lu";

import { auth } from "@petzo/auth-center-app";
import { SERVICES_CONFIG } from "@petzo/constants";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@petzo/ui/components/table";
import { centerUtils } from "@petzo/utils";

import SignIn from "~/app/_components/sign-in";
import { env } from "~/env";
import { api } from "~/trpc/server";
import ParallelServicesConfig from "../../_components/parallel_services_config";

export default async function Page({
  params: { centerPublicId },
  searchParams: { onboarding },
}: {
  params: { centerPublicId: string };
  searchParams: { onboarding: boolean };
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view your
              services.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const center = await api.center.getCenter({ centerPublicId });
  const services = await api.service.getServices({ centerPublicId });

  const serviceTypes = Array.from(
    new Set(services?.map((service) => service.serviceType)),
  );

  const hasAnyService = services?.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Services</h1>
        {!onboarding && (
          <Link
            href={`/dashboard/${centerPublicId}/services/create${hasAnyService ? "" : "?onboarding=true"}`}
          >
            <Button
              variant="primary"
              className="flex items-center justify-center gap-1"
            >
              New Service
            </Button>
          </Link>
        )}
      </div>

      {services.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium">Config</h3>
          <ParallelServicesConfig serviceTypes={serviceTypes} center={center} />
        </div>
      )}

      {!onboarding && (
        <div className="mt-5">
          {services.length > 0 && (
            <h3 className="font-medium">Services List</h3>
          )}

          {services.length ? (
            <Table className="mt-2">
              <TableCaption>List of all services.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20px]"></TableHead>
                  <TableHead className="min-w-[100px]">Service Name</TableHead>
                  <TableHead className="min-w-[100px]">Service Type</TableHead>
                  <TableHead className="min-w-[100px]">Price</TableHead>
                  <TableHead className="min-w-[100px]">
                    Discounted Price
                  </TableHead>
                  <TableHead className="">Preview</TableHead>
                  <TableHead className="text-right">Edit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.map((service, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      <Link
                        className="cursor-pointer hover:underline"
                        href={`/dashboard/pets/${service.id}`}
                      >
                        {idx + 1}
                      </Link>
                    </TableCell>
                    <TableCell>{service?.name}</TableCell>
                    <TableCell>
                      {SERVICES_CONFIG[service?.serviceType]?.name}
                    </TableCell>
                    <TableCell>&#8377; {service?.price}</TableCell>
                    <TableCell>&#8377; {service?.discountedPrice}</TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`${centerUtils.getServiceDetailsUrl(service, center!, env.CUSTOMER_APP_BASE_URL)}`}
                        className="group flex items-center justify-start text-sm hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>View</span>
                        <FiArrowUpRight size={18} />
                      </a>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/${centerPublicId}/services/${service.publicId}/edit`}
                        className="flex items-center justify-end gap-1 hover:underline"
                      >
                        <span>Edit</span>
                        <LuPencil strokeWidth={2.5} size={14} />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2 py-2 text-center text-lg text-foreground/80">
              <span>
                No <span className="font-semibold">Services</span> added yet.
                Click <span className="font-semibold">New Service</span> to
                create a new service.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

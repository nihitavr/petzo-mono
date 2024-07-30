import Link from "next/link";
import { LuPencil } from "react-icons/lu";

import { auth } from "@petzo/auth-center-app";
import { SERVICES_CONFIG } from "@petzo/constants";
import { Center } from "@petzo/db";
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
import { urlUtils } from "@petzo/utils";

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

  const services = await api.service.getServices({ centerPublicId });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Services</h1>
      </div>

      {services.length ? (
        <Table className="mt-3">
          <TableCaption>List of all services.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]"></TableHead>
              <TableHead className="min-w-[100px]">Service Name</TableHead>
              <TableHead className="min-w-[100px]">Service Type</TableHead>
              <TableHead className="min-w-[100px]">Price</TableHead>
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
                <TableCell className="text-right">
                  <a
                    href={`${env.CUSTOMER_APP_BASE_URL}${urlUtils.createServiceUrl(service, { publicId: centerPublicId, name: `preview ${centerPublicId}` } as Center)}`}
                    className="flex items-center justify-start text-sm text-blue-700 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>View</span>
                  </a>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/${centerPublicId}/services/${service.publicId}/edit`}
                    className="flex justify-end opacity-70 hover:opacity-50"
                  >
                    <LuPencil strokeWidth={3} size={18} />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2 py-2 text-center text-lg text-foreground/80">
          <span>
            No <span className="font-semibold">Services</span> added yet. Click{" "}
            <span className="font-semibold">Add New Service</span> to create a
            new service.
          </span>
        </div>
      )}
    </div>
  );
}

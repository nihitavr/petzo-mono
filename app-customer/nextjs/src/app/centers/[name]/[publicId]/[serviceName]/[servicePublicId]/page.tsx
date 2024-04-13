import Link from "next/link";

import type { Center, Service } from "@petzo/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@petzo/ui/components/breadcrumb";
import NotFound from "@petzo/ui/components/not-found";

import ImagesCasousel from "~/app/centers/_components/images-carousel";
import { ServiceInfo } from "~/app/centers/_components/service-info";
import {
  getCenterRelativeUrl,
  getServiceRelativeUrl,
} from "~/lib/utils/center.utils";
import { api } from "~/trpc/server";

export default async function Page({
  params: { publicId, servicePublicId },
}: {
  params: { publicId: string; servicePublicId: string };
}) {
  const center = await api.center.findByPublicId({
    publicId,
  });

  if (!center) return <NotFound />;

  const service = await api.service.findByPublicId({
    publicId: servicePublicId,
  });

  if (!service) return <NotFound />;

  const imageUrls = service.images?.map((img) => img.url) ?? [];

  return (
    <div className="flex flex-col gap-2 py-4 md:py-4">
      <ServiceBreadcrumb
        className="px-2 md:px-0"
        service={service}
        center={center}
      />
      {/* Center Image & Center Info */}
      <div className="flex grid-cols-10 flex-col gap-2 md:grid md:gap-5">
        {/* Center Images */}
        <div className="col-span-4 w-full p-2 md:p-0">
          <ImagesCasousel
            images={imageUrls}
            className="aspect-square w-full"
            imageClassName="rounded-md border-none"
          />
        </div>

        {/* Center Info */}
        <ServiceInfo
          className={`${!imageUrls.length ? "col-span-10" : "col-span-6"} h-min rounded-lg bg-primary/[7%] p-3`}
          service={service}
          center={center}
        />
      </div>
    </div>
  );
}

const ServiceBreadcrumb = ({
  service,
  center,
  className,
}: {
  service: Service;
  center: Center;
  className?: string;
}) => {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <span>Centers</span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link className="hover:underline" href={getCenterRelativeUrl(center)}>
            {center.name}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link
            className="hover:underline"
            href={getServiceRelativeUrl(service, center)}
          >
            {service.name}
          </Link>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

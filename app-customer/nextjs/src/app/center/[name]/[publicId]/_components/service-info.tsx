import type { Center, Service } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { cn } from "@petzo/ui/lib/utils";

export const ServiceInfo = ({
  service,
  center,
  className,
}: {
  service: Service;
  center: Center;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col gap-2 overflow-y-auto pt-0", className)}>
      {/* Service name */}
      <div>
        <h1 className="line-clamp-2 text-lg font-semibold md:text-xl">
          {service?.name}
        </h1>
        <span className="line-clamp-1 text-sm font-semibold text-primary">
          at {center.name}
        </span>
      </div>

      {/* Service Description */}
      <span>{service.description}</span>

      <div className="flex w-full justify-start">
        <Button className="w-full md:w-72">Add</Button>
      </div>
    </div>
  );
};

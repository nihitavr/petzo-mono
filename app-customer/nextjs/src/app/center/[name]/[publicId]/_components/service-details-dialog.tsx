"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import type { Center, Service } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@petzo/ui/components/dialog";

import {
  getCenterRelativeUrl,
  getServiceRelativeUrl,
} from "~/lib/utils/center.utils";
import ServiceImagesCasousel from "./service-images-carousel";

export function ServiceDetailsDialog({
  service,
  center,
}: {
  center: Center;
  service: Service;
}) {
  const pathname = usePathname();

  const [isDialogOpen, setDialogOpen] = useState(false);

  const imageUrls = service.images?.map((img) => img.url) ?? [];

  const closeDialog = (open: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!open && window.history.state.dialogOpen) window.history.back();
    setDialogOpen(open);
  };

  // This is to open the
  useEffect(() => {
    if (pathname == getServiceRelativeUrl(service, center)) setDialogOpen(true);
  }, [pathname, service, center]);

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      if (isDialogOpen) {
        event.preventDefault();
        closeDialog(false);
      }
    };

    if (isDialogOpen) {
      const centerPushUrl = `${getCenterRelativeUrl(center)}`;
      const servicePushUrl = `${getServiceRelativeUrl(service, center)}`;

      if (pathname === servicePushUrl)
        window.history.replaceState({}, "", centerPushUrl);

      window.history.pushState({ dialogOpen: true }, "", servicePushUrl);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [isDialogOpen, center, service]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
      <DialogTrigger asChild>
        <Button
          className="mt-2 h-min w-min px-2 py-1 text-xs text-foreground/80"
          size="sm"
          variant="outline"
        >
          View Details {">"}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh] rounded-xl p-0 pb-[50px] sm:max-w-[425px] md:h-[90vh]">
        <div className="h-[80vh] overflow-y-auto p-6 pb-16 md:h-[90vh]">
          <div className="flex flex-col ">
            <ServiceImagesCasousel
              images={imageUrls}
              className="aspect-square w-full"
              imageClassName="rounded-md border-none"
            />
            <div>
              <div className="py-2">
                <h3 className="text-xl font-semibold md:text-2xl">
                  {service.name}
                </h3>
                <div className="-mt-0.5 text-sm font-semibold text-primary md:text-base">
                  at {center?.name}
                </div>
              </div>
              <DialogDescription>{service.description}</DialogDescription>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

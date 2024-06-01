"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LuX } from "react-icons/lu";

import type { Center, Service } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";
import { Label } from "@petzo/ui/components/label";

import { useMediaQuery } from "~/lib/hooks/screen.hooks";
import {
  getCenterRelativeUrl,
  getServiceRelativeUrl,
} from "~/lib/utils/center.utils";
import ServiceImagesCasousel from "./service-images-carousel";

export function ServiceDetailsModal({
  service,
  center,
  open,
  setOpen,
}: {
  center: Center;
  service: Service;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // const [open, setOpen] = useState(false);

  const imageUrls = service.images?.map((img) => img.url) ?? [];

  const onOpenChange = (open: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!open && window.history.state.dialogOpen) window.history.back();

    setOpen(open);
  };

  // This is to open the
  useEffect(() => {
    if (pathname == getServiceRelativeUrl(service, center)) setOpen(true);
  }, [pathname, service, center]);

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      if (open) {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    if (open) {
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
  }, [open, center, service]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button
            className="mt-2 h-min w-min px-2 py-0.5 text-xs text-foreground/80"
            size="sm"
            variant="outline"
          >
            View Details {">"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] rounded-md p-0 pb-[50px] sm:max-w-[425px] md:max-h-[90vh]">
          <div className="max-h-[90vh] overflow-y-auto p-3 md:max-h-[90vh] md:p-4">
            <div className="flex flex-col">
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
                <DialogDescription className="whitespace-pre-wrap">
                  <Label>Details</Label>
                  <span className="mt-2 block text-foreground/90">
                    {service.description}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          className="mt-2 h-min w-min px-2 py-0.5 text-xs text-foreground/80"
          size="sm"
          variant="outline"
        >
          View Details {">"}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] min-h-[50vh] rounded-t-2xl border-none p-0">
        <div className=" overflow-y-auto rounded-t-2xl md:p-4">
          <div className="flex flex-col">
            <ServiceImagesCasousel
              images={imageUrls}
              className="aspect-square w-full "
              imageClassName="border-none rounded-t-2xl"
            />
            <div className="p-2 px-2.5">
              <div className="pb-2">
                <h3 className="text-lg font-semibold md:text-xl">
                  {service.name}
                </h3>
                <div className="-mt-0.5 text-sm font-semibold text-primary md:text-base">
                  at {center?.name}
                </div>
              </div>
              <DrawerDescription className="whitespace-pre-wrap">
                <Label>Details</Label>
                <span className="mt-2 block text-foreground/90">
                  {service.description}
                </span>
              </DrawerDescription>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

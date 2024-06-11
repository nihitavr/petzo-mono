"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

import type { Center, CustomerUser, Service } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";
import { Label } from "@petzo/ui/components/label";
import { iOS } from "@petzo/ui/lib/utils";

import Price from "~/app/_components/price";
import { useMediaQuery } from "~/lib/hooks/screen.hooks";
import { getCenterUrl, getServiceUrl } from "~/lib/utils/center.utils";
import { BookServiceDialog } from "./book-service-modal";
import ServiceImagesCasousel from "./service-images-carousel";

export function ServiceDetailsModal({
  service,
  center,
  open,
  setOpen,
  user,
}: {
  center: Center;
  service: Service;
  open: boolean;
  setOpen: (open: boolean) => void;
  user?: CustomerUser;
}) {
  const serviceUrl = useMemo(() => getServiceUrl(service, center), []);
  const centerUrl = useMemo(() => getCenterUrl(center), []);

  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const imageUrls = service.images?.map((img) => img.url) ?? [];

  const onOpenChange = (open: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!open && pathname == serviceUrl) window.history.back();

    setOpen(open);
  };

  // This is to open the
  useEffect(() => {
    if (pathname == serviceUrl) setOpen(true);
  }, [pathname]);

  useEffect(() => {
    const handleBackButton = () => {
      if (open) setOpen(false);
    };

    if (pathname == serviceUrl) window.history.replaceState({}, "", centerUrl);

    if (open) {
      window.history.pushState({}, "", serviceUrl);
      window.addEventListener("popstate", handleBackButton);
    }

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [open, center?.id, service?.id]);

  if (isDesktop || iOS()) {
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
        <DialogContent className="max-h-[80vh] rounded-xl p-0 pb-[50px] sm:max-w-[425px] ">
          <div className="max-h-[80vh] overflow-y-auto p-3 md:p-4">
            <div className="flex flex-col">
              <ServiceImagesCasousel
                images={imageUrls}
                className="aspect-[5/4] w-full"
                imageClassName="rounded-md border-none"
              />
              <div>
                <div className="flex items-center justify-between">
                  <div className="py-2">
                    <h3 className="text-xl font-semibold md:text-2xl">
                      {service.name}
                    </h3>
                    <div className="-mt-0.5 text-sm font-semibold text-primary md:text-base">
                      at {center?.name}
                    </div>
                  </div>

                  <BookServiceDialog
                    service={service}
                    center={center}
                    user={user}
                  />
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
      <DrawerContent className="h-[83vh] min-h-[50vh] rounded-t-3xl border-none p-0">
        <div className=" overflow-y-auto rounded-t-3xl md:p-4">
          <div className="flex flex-col">
            <ServiceImagesCasousel
              images={imageUrls}
              className="aspect-[5/4] w-full "
              imageClassName="border-none rounded-t-3xl"
            />
            <div className="p-3">
              <div className="items-center1 flex justify-between">
                <div className="pb-2">
                  <h3 className="text-lg font-semibold md:text-xl">
                    {service.name}
                  </h3>
                  <div className="-mt-0.5 text-sm font-semibold text-primary md:text-base">
                    at {center?.name}
                  </div>
                  <div className="mt-1">
                    <Price
                      price={service.price}
                      className="text-base font-bold"
                    />
                  </div>
                </div>

                <div className="mt-2 flex flex-col items-center gap-1">
                  <BookServiceDialog
                    service={service}
                    center={center}
                    user={user}
                  />
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

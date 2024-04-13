import type { Center, Service } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import { Input } from "@petzo/ui/components/input";
import { Label } from "@petzo/ui/components/label";

import ServiceImagesCasousel from "./service-images-carousel";

export function ServiceDetailsDialog({
  service,
}: {
  center?: Center;
  service: Service;
}) {
  const imageUrls = service.images?.map((img) => img.url) ?? [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="mt-2 h-min w-min px-2 py-1 text-xs text-foreground/80"
          size="sm"
          variant="outline"
        >
          View Details {">"}
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto sm:max-w-[425px]">
        <DialogHeader className="flex flex-col gap-2">
          <ServiceImagesCasousel
            images={imageUrls}
            className="aspect-square w-full"
            imageClassName="rounded-md border-none"
          />
          <DialogTitle>{service.name}</DialogTitle>
          <DialogDescription>{service.description}</DialogDescription>
          <DialogDescription>{service.description}</DialogDescription>
        </DialogHeader>
        <Button>Add</Button>
      </DialogContent>
    </Dialog>
  );
}

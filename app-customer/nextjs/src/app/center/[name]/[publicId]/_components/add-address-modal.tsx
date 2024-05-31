"use client";

import { useState } from "react";

import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";

import { AddressForm } from "~/app/dashboard/_components/form/address-form";
import { useMediaQuery } from "~/lib/hooks/screen.hooks";

export default function NewAddessModal({
  onAddNewAddress,
}: {
  onAddNewAddress: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState(false);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="h-6" size="sm">
            Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent
          shouldOverlay={false}
          className="no-scrollbar mb-5 h-[90vh] overflow-y-auto rounded-t-md px-3 pb-0"
        >
          <AddressForm
            onFormSubmit={() => {
              onAddNewAddress();
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="h-6" size="sm">
          Add New Address
        </Button>
      </DrawerTrigger>
      <DrawerContent
        shouldOverlay={false}
        className="h-[90vh] rounded-t-md px-2"
      >
        <DrawerClose className="absolute right-4 top-2" asChild>
          <span className="text-xl font-semibold">X</span>
        </DrawerClose>
        <div className="no-scrollbar relative overflow-y-auto pb-10">
          <AddressForm
            onFormSubmit={() => {
              onAddNewAddress();
              setOpen(false);
            }}
          />
        </div>

        <DrawerFooter className="flex w-full flex-row items-center gap-1 pt-2"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

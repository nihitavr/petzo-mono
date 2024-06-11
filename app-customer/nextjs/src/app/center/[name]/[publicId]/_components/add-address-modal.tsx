"use client";

import { useState } from "react";

import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";
import { iOS } from "@petzo/ui/lib/utils";

import { AddressForm } from "~/app/dashboard/_components/form/address-form";
import { useMediaQuery } from "~/lib/hooks/screen.hooks";

export default function NewAddessModal({
  onAddNewAddress,
}: {
  onAddNewAddress: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [open, setOpen] = useState(false);

  if (isDesktop || iOS())
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="h-6" size="sm">
            Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent
          shouldOverlay={false}
          className="no-scrollbar mb-5 h-[80vh] overflow-y-auto rounded-t-3xl px-3 pb-0"
        >
          <div className="no-scrollbar relative overflow-y-auto pb-10">
            <AddressForm
              onFormSubmit={() => {
                onAddNewAddress();
                setOpen(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="h-6" size="sm">
          Add New Address
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[83vh] rounded-t-3xl px-2 pt-3">
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

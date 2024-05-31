import { useState } from "react";

import { Button } from "@petzo/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@petzo/ui/components/drawer";

import { AddressForm } from "~/app/dashboard/_components/form/address-form";

export default function NewAddessModal({
  onAddNewAddress,
}: {
  onAddNewAddress: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="h-6" size="sm">
          Add New Address
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] rounded-t-md px-2">
        <DrawerClose className="absolute right-4 top-2" asChild>
          <span className="text-xl font-semibold">X</span>
        </DrawerClose>
        <div className="no-scrollbar overflow-y-auto pb-10">
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

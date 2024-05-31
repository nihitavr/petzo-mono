"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@petzo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@petzo/ui/components/dialog";
import Loader from "@petzo/ui/components/loader";

import { api } from "~/trpc/react";

export default function DeleteAddressButton({
  addressId,
}: {
  addressId: number;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const deleteAddress = api.customerAddress.deleteAddress.useMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="h-6 bg-background text-xs font-medium text-destructive shadow-none">
          Delete
        </span>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-2 rounded-md">
        <span>Are you sure you want to delete this address?</span>
        <div className="flex w-full items-center gap-2">
          <Button
            onClick={async () => {
              setDeleteLoading(true);
              try {
                await deleteAddress.mutateAsync({ id: addressId });
              } catch (e) {
                // Pass
              }
              setDeleteLoading(false);
              setOpen(false);
              router.refresh();
            }}
            variant="destructive"
            className="flex w-1/2 items-center gap-1 md:w-fit"
          >
            Delete <Loader className="h-5 w-5 border-2" show={deleteLoading} />
          </Button>
          <DialogClose className="w-1/2 md:w-fit">
            <Button className="w-full">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

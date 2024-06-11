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
import { titleCase } from "@petzo/utils";

import { api } from "~/trpc/react";

export default function DeletePetButton({
  petId,
  petName,
}: {
  petId: number;
  petName: string;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const deletePet = api.pet.deletePet.useMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <p className="bg-muted text-xs font-medium text-destructive shadow-none">
          Delete
        </p>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-2 rounded-xl">
        <span>
          Are you sure you want to delete {titleCase(petName)}&apos;s profile?
        </span>
        <div className="flex w-full items-center gap-2">
          <Button
            onClick={async () => {
              setDeleteLoading(true);
              try {
                await deletePet.mutateAsync({ id: petId });
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
            Delete <Loader className="size-4 border-2" show={deleteLoading} />
          </Button>
          <DialogClose className="w-1/2 md:w-fit">
            <Button className="w-full">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

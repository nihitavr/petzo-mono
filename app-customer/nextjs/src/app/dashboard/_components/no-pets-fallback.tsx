import Link from "next/link";
import { PiPawPrintFill } from "react-icons/pi";

import { Button } from "@petzo/ui/components/button";

export default function NoPetsFallback({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center text-foreground/80 md:col-span-4">
      {children ? (
        children
      ) : (
        <span>
          No pets added yet. Click{" "}
          <span className="font-semibold">Add Pet </span> to create a new pet
          profile.
        </span>
      )}

      <Link href={"/dashboard/pets/add"}>
        <Button
          variant="primary"
          className="flex items-center justify-center gap-1"
        >
          Add Pet
          <PiPawPrintFill strokeWidth={2.5} className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

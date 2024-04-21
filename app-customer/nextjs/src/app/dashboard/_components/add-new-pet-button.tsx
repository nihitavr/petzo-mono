import Link from "next/link";
import { PiPawPrintFill } from "react-icons/pi";

import { Button } from "@petzo/ui/components/button";

export default function AddNewPetButton({ className }: { className?: string }) {
  return (
    <Link className={className} href={"/dashboard/pets/add"}>
      <Button
        variant="primary"
        className="flex items-center justify-center gap-1"
      >
        Add Pet
        <PiPawPrintFill strokeWidth={2.5} className="h-4 w-4" />
      </Button>
    </Link>
  );
}

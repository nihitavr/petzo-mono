import { BiSolidDog } from "react-icons/bi";

import { cn } from "../../../lib/utils";

export default function SmallDog({ className }: { className?: string }) {
  return <BiSolidDog className={cn("size-4 text-foreground/90", className)} />;
}

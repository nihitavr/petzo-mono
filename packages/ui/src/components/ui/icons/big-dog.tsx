import { FaDog } from "react-icons/fa6";

import { cn } from "../../../lib/utils";

export default function BigDog({ className }: { className?: string }) {
  return <FaDog className={cn("size-5 text-foreground/90", className)} />;
}

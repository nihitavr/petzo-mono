import { FaCat } from "react-icons/fa6";

import { cn } from "../../../lib/utils";

export default function Cat({ className }: { className?: string }) {
  return <FaCat className={cn("size-4 text-foreground/90", className)} />;
}

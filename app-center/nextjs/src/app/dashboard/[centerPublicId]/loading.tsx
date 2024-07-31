import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiCheckCircle } from "react-icons/fi";
import { IoTodayOutline } from "react-icons/io5";
import { VscServerProcess } from "react-icons/vsc";

import { Skeleton } from "@petzo/ui/components/skeleton";

export default async function Loading() {
  return (
    <div className="flex flex-col gap-2">
      <div className="py-3 text-center text-xl font-semibold md:text-2xl">
        <span className="block md:inline">Here&apos;s an overview of</span>{" "}
        <span className="block md:inline">your bookings for the day!</span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="aspect-square w-full rounded-2xl" />
      </div>
    </div>
  );
}

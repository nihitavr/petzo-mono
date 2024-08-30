import type { Center } from "@petzo/db";
import { timeUtils } from "@petzo/utils";

export default function CenterTimings({ center }: { center: Center }) {
  if (!timeUtils.getTimings(center.operatingHours)) return null;

  return (
    <div>
      <span className="text-2sm font-medium opacity-80 md:text-sm">
        Timings:{" "}
      </span>
      <span className="text-2sm font-medium md:text-sm">
        {timeUtils.getTimings(center.operatingHours)}
      </span>
    </div>
  );
}

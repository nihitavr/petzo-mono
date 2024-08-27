import { format, parse } from "date-fns";

import type { BookingItem } from "@petzo/db";
import {
  BOOKING_STATUS_CONFIG,
  PET_TYPE_CONFIG,
  SERVICES_CONFIG,
} from "@petzo/constants";
import Price from "@petzo/ui/components/price";

const BookingItemInfo = ({ bookingItem }: { bookingItem: BookingItem }) => {
  return (
    <div className={`flex w-full animate-fade-in flex-col gap-0.5`}>
      <div className="flex items-center justify-between text-2sm md:text-sm">
        <span className="text-2sm text-foreground/70 md:text-sm">
          Booking Item Id: <span className="font-medium">{bookingItem.id}</span>
        </span>
        <span
          className="font-semibold"
          style={{ color: BOOKING_STATUS_CONFIG[bookingItem.status].textColor }}
        >
          {BOOKING_STATUS_CONFIG[bookingItem.status].name}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="line-clamp-1 text-sm font-semibold md:text-base">
          {bookingItem.service?.name}
        </span>
        <Price
          className="text-sm font-semibold md:text-base"
          price={bookingItem.amount}
        />
      </div>
      <span className="text-sm text-foreground/70 md:text-base">
        Start Time:{" "}
        <span className="font-medium text-green-600 underline">
          {format(
            parse(
              bookingItem.slot!.startTime,
              "HH:mm:ss",
              new Date(bookingItem.slot!.date),
            ),
            "EEE do MMM, h:mm a",
          )}
        </span>
      </span>
      <span className="text-sm text-foreground/70 md:text-base">
        Service Type:{" "}
        <span className="font-medium">
          {SERVICES_CONFIG[bookingItem.service!.serviceType]?.name}
        </span>
      </span>
      <span className="text-sm text-foreground/70 md:text-base">
        Booking for:{" "}
        <span className="font-medium">
          {bookingItem?.pet?.name} (
          {PET_TYPE_CONFIG[bookingItem.pet!.type!].name})
        </span>
      </span>
    </div>
  );
};

export default BookingItemInfo;

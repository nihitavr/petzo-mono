import { format, parse } from "date-fns";

import type { BookingItem } from "@petzo/db";
import { PET_TYPE_CONFIG, SERVICES_CONFIG } from "@petzo/constants";

import Price from "~/app/_components/price";

export type Items = BookingItem[];

const BookingItems = ({ items }: { items: Items }) => {
  return (
    <div className="flex flex-col gap-3">
      {items?.map((item, idx) => (
        <div
          key={`service-no-${idx}-${item.service?.id}-${item.slot?.id}-${item.pet?.id}`}
          className={`flex animate-fade-in flex-col gap-0.5`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1 text-sm font-medium md:text-base">
              {item.service?.name}
            </span>
            <Price
              className="text-2sm font-semibold md:text-sm"
              price={item.service!.price}
            />
          </div>
          <span className="text-sm text-foreground/70 md:text-base">
            Start Time:{" "}
            <span className="font-medium text-green-600 underline">
              {format(
                parse(
                  item.slot!.startTime,
                  "HH:mm:ss",
                  new Date(item.slot!.date),
                ),
                "EEE do MMM, h:mm a",
              )}
            </span>
          </span>
          <span className="text-sm text-foreground/70 md:text-base">
            Service Type:{" "}
            <span className="font-medium">
              {SERVICES_CONFIG[item.service!.serviceType]?.name}
            </span>
          </span>
          <span className="text-sm text-foreground/70 md:text-base">
            Booking for:{" "}
            <span className="font-medium">
              {item?.pet?.name} ({PET_TYPE_CONFIG[item.pet!.type!]})
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default BookingItems;

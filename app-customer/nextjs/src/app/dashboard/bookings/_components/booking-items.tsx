import { format, parse } from "date-fns";

import type { BookingItem } from "@petzo/db";

import Price from "~/app/_components/price";

export type Items = BookingItem[];

const BookingItems = ({ items }: { items: Items }) => {
  return (
    <div className="flex flex-col gap-5">
      {items?.map((item, idx) => (
        <div
          key={`service-no-${idx}-${item.service?.id}-${item.slot?.id}-${item.pet?.id}`}
          className={`flex animate-fade-in items-start justify-between gap-2`}
        >
          <div className="flex flex-col gap-0.5">
            <span className="line-clamp-1 text-2sm font-medium md:text-sm">
              {item.service?.name}
            </span>
            <span className="text-xs text-foreground/70 md:text-2sm">
              Booking for:{" "}
              <span className="font-medium text-primary">
                {item?.pet?.name}
              </span>
            </span>
            <span className="line-clamp-1 text-xs text-foreground/70 md:text-2sm">
              Start Time:{" "}
              <span className="font-medium">
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
          </div>
          <div className="flex flex-col items-center">
            <Price
              className="text-2sm font-semibold md:text-sm"
              price={item.service!.price}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingItems;

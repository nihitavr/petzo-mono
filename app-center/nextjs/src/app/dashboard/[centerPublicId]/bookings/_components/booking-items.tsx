import { Fragment } from "react";

import type { Booking, BookingItem } from "@petzo/db";

import AcceptBookingButton from "./accept-booking-button";
import BookingItemInfo from "./booking-item-info";
import CancelBookingButton from "./cancel-booking-button";
import CompleteBookingButton from "./complete-booking-button";
import StartBookingButton from "./start-booking-button";

const BookingItems = ({
  bookingItems: items,
  centerPublicId,
  booking,
  selectedType,
}: {
  centerPublicId: string;
  booking: Booking;
  bookingItems: BookingItem[];
  selectedType: string;
}) => {
  return (
    <div className="flex flex-col gap-3">
      {items?.map((item, idx) => (
        <Fragment key={item.id}>
          {idx > 0 && <hr />}
          <div className="flex w-full flex-col justify-between md:flex-row md:gap-4">
            <BookingItemInfo
              key={`service-no-${idx}-${item.service?.id}-${item.slot?.id}-${item.pet?.id}`}
              bookingItem={item}
            />
            <div className="mt-3 flex w-full cursor-pointer flex-col justify-center gap-2 md:mt-0 md:w-64 md:border-l md:pl-3">
              {selectedType === "new" && (
                <>
                  <AcceptBookingButton
                    centerPublicId={centerPublicId}
                    booking={booking}
                    bookingItem={item}
                  />
                  <CancelBookingButton
                    centerPublicId={centerPublicId}
                    booking={booking}
                    bookingItem={item}
                  />
                </>
              )}

              {selectedType === "today" && (
                <StartBookingButton
                  centerPublicId={centerPublicId}
                  booking={booking}
                  bookingItem={item}
                />
              )}

              {selectedType === "active" && (
                <CompleteBookingButton
                  centerPublicId={centerPublicId}
                  booking={booking}
                  bookingItem={item}
                />
              )}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default BookingItems;

import { Fragment } from "react";
import Link from "next/link";
import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { FiPhone } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";

import { Button } from "@petzo/ui/components/button";
import { Label } from "@petzo/ui/components/label";
import { getGoogleLocationLink } from "@petzo/utils";
import { getDateString } from "@petzo/utils/time";

import type { Items } from "./booking-items";
import Price from "~/app/_components/price";
import { BOOKING_TYPE_TO_STATUS } from "~/lib/constants";
import { api } from "~/trpc/server";
import AcceptBookingButton from "./accept-booking-button";
import BookingItems from "./booking-items";
import { BookingTypeInfo } from "./booking-type-bar";

export default async function Bookings({
  centerPublicId,
  type,
}: {
  centerPublicId: string;
  type: string;
}) {
  let date;
  if (type === "today") {
    const today = getDateString();
    date = { startDate: today, endDate: today };
  }

  const bookings = await api.booking.getBookingsForCenter({
    centerPublicId: centerPublicId,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    status: BOOKING_TYPE_TO_STATUS[type] as unknown as any,
    date: date,
  });

  return (
    <>
      <BookingTypeInfo selectedType={type} />
      <div className="flex flex-col gap-5">
        {bookings?.length ? (
          <>
            {bookings.map((booking) => {
              const bookingUrl = `/dashboard/${centerPublicId}/bookings/${booking.id}`;

              return (
                <div
                  className="flex w-full flex-col gap-2 overflow-hidden rounded-md border pb-2"
                  key={booking.id}
                >
                  <div className="flex items-center justify-between bg-foreground/10 p-2">
                    <span className="text-sm font-medium text-foreground/70 md:text-base">
                      Booking Id: {booking.id}
                    </span>
                    <span className="text-sm font-semibold text-foreground/70 md:text-base">
                      Total: <Price className="inline" price={booking.amount} />
                    </span>
                  </div>

                  <div className="px-2">
                    <Label className="text-foreground/80">
                      Customer Details
                    </Label>
                    <div className="mt-1 flex flex-col gap-1.5 rounded-lg border bg-foreground/[3%] p-2 text-sm md:text-base">
                      {/* Booking Status */}
                      {/* <div>
                          <span>Status: </span>
                          <span
                            style={{
                              color:
                                BOOKING_STATUS_CONFIG[booking.status].textColor,
                            }}
                            className={`font-bold capitalize `}
                          >
                            {BOOKING_STATUS_CONFIG[booking.status].name}
                          </span>
                        </div> */}

                      {/* Booking Customer Name */}
                      <div>
                        <span>Customer Name:</span>{" "}
                        <span className="font-semibold">
                          {booking.user?.name}
                        </span>
                      </div>

                      {/* Booking Address */}
                      <div className="flex items-center gap-1">
                        <span>Phone Number:</span>{" "}
                        <a
                          href={`tel:${booking.address?.phoneNumber}`}
                          className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-500"
                        >
                          <FiPhone />
                          <span>{booking.address?.phoneNumber}</span>
                        </a>
                      </div>

                      {/* Booking Address */}
                      <div>
                        <span>Address: </span>
                        <a
                          href={getGoogleLocationLink(booking.address?.geocode)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="font-medium text-blue-700 dark:text-blue-500">
                            {getFullFormattedAddresses(booking.address)}
                          </span>{" "}
                          <GrLocation
                            className="mb-0.5 inline text-blue-700 dark:text-blue-500"
                            size={18}
                          />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/*  */}
                  <div className="p-2 pt-0">
                    <Label className="text-foreground/80">
                      Services Booked
                    </Label>
                    <div className="mt-1 rounded-xl border bg-foreground/[3%] px-2.5 py-1.5">
                      <BookingItems
                        items={booking?.items as unknown as Items}
                      />
                    </div>
                  </div>
                  <div className="flex px-2 md:justify-end">
                    <div className="flex w-full gap-2 md:w-1/2">
                      {/* <Link href={bookingUrl} className="w-1/2 cursor-pointer">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full space-x-0.5"
                        >
                          <span>View Details</span>
                        </Button>
                      </Link> */}
                      <div className="w-full cursor-pointer">
                        <AcceptBookingButton
                          centerPublicId={centerPublicId}
                          booking={booking}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex h-20 items-center justify-center text-center text-foreground/80">
            <span>No Bookings Yet!</span>
          </div>
        )}
      </div>
    </>
  );
}

import { getFullFormattedAddresses } from "node_modules/@petzo/utils/src/addresses.utils";
import { FiPhone } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";

import type { Booking, BookingItem, CustomerAddresses } from "@petzo/db";
import { auth } from "@petzo/auth-center-app";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";
import { Label } from "@petzo/ui/components/label";
import Price from "@petzo/ui/components/price";
import { getGoogleLocationLink } from "@petzo/utils";
import { getDateString } from "@petzo/utils/time";

import SignIn from "~/app/_components/sign-in";
import { BOOKING_TYPE_TO_STATUS } from "~/lib/constants";
import { api } from "~/trpc/server";
import BookingItems from "./booking-items";
import { BookingTypeInfo } from "./booking-type-bar";

export default async function Bookings({
  centerPublicId,
  type,
}: {
  centerPublicId: string;
  type: string;
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view
              center bookings.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  let date;
  if (type === "today") {
    const today = getDateString();
    date = { startDate: today, endDate: today };
  }

  const bookings = (await api.booking.getBookingsForCenter({
    centerPublicId: centerPublicId,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    status: BOOKING_TYPE_TO_STATUS[type] as unknown as any,
    date: date,
  })) as Booking[];

  return (
    <>
      <BookingTypeInfo selectedType={type} />
      <div className="flex flex-col gap-5">
        {bookings?.length ? (
          <>
            {bookings.map((booking) => {
              // const bookingUrl = `/dashboard/${centerPublicId}/bookings/${booking.id}`;
              const phoneNumber =
                booking.address?.phoneNumber ?? booking?.phoneNumber;

              return (
                <div
                  className="flex w-full flex-col gap-2 overflow-hidden rounded-md border border-foreground/20 pb-2"
                  key={booking.id}
                >
                  <div className="flex items-center justify-between border-b border-foreground/20 bg-foreground/10 p-2">
                    <span className="text-base font-medium text-foreground/80 md:text-lg">
                      Booking Id: {booking.id}
                    </span>
                    <span className="text-base font-medium text-foreground/80 md:text-lg">
                      Total: <Price className="inline" price={booking.amount} />
                    </span>
                  </div>

                  <div className="px-2">
                    <Label className="text-foreground/80">
                      Customer Details
                    </Label>
                    <div className="mt-1 flex flex-col gap-1.5 rounded-lg border bg-foreground/[3%] p-2 text-sm md:text-base">
                      {/* Customer Name */}
                      <div>
                        <span>Customer Name:</span>{" "}
                        <span className="font-semibold">
                          {booking.user?.name}
                        </span>
                      </div>

                      {/* Booking Address */}
                      <div className="flex items-center gap-1">
                        <span>Phone Number:</span>{" "}
                        {phoneNumber ? (
                          <a
                            href={`tel:${phoneNumber}`}
                            className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-500"
                          >
                            <FiPhone />
                            <span>{phoneNumber}</span>
                          </a>
                        ) : (
                          <span className="text-destructive">N/A</span>
                        )}
                      </div>

                      {/* Booking Address */}
                      {booking.address && (
                        <div>
                          <span>Address: </span>
                          <a
                            href={getGoogleLocationLink(
                              booking.address?.geocode,
                            )}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="font-medium text-blue-700 dark:text-blue-500">
                              {getFullFormattedAddresses(
                                booking.address as CustomerAddresses,
                              )}
                            </span>{" "}
                            <GrLocation
                              className="mb-0.5 inline text-blue-700 dark:text-blue-500"
                              size={18}
                            />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/*  */}
                  <div className="p-2 pt-0">
                    <Label className="text-foreground/80">
                      Services Booked ({booking.items?.length})
                    </Label>
                    <div className="mt-1 rounded-xl border bg-foreground/[3%] px-2.5 py-1.5">
                      <BookingItems
                        bookingItems={booking?.items as BookingItem[]}
                        centerPublicId={centerPublicId}
                        booking={booking}
                        selectedType={type}
                      />
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

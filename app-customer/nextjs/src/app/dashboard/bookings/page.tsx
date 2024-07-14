import { Fragment } from "react";
import Link from "next/link";
import { TbReload } from "react-icons/tb";

import type { Center } from "@petzo/db";
import { auth } from "@petzo/auth-customer-app";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import type { Items } from "./_components/booking-items";
import Price from "~/app/_components/price";
import SignIn from "~/app/_components/sign-in";
import { BOOKING_STATUS } from "~/lib/constants";
import { getCenterUrl } from "~/lib/utils/center.utils";
import { api } from "~/trpc/server";
import BookingItems from "./_components/booking-items";
import { CancelBookingButton } from "./_components/cancel-booking-button";

export default async function Page() {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view Your
              Pet&apos;s Bookings.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  const bookings = await api.booking.getBookings();

  return (
    <div>
      {/* Your Bookings */}
      <h1 className="text-xl font-semibold">Your Bookings</h1>
      <div className="flex flex-col">
        {bookings?.length ? (
          <>
            <hr className="mb-5 mt-2 border-foreground/20" />
            {bookings.map((booking) => {
              const centerUrl = getCenterUrl(booking?.center as Center);
              const total =
                booking?.items?.reduce(
                  (acc, item) => acc + item.service.price,
                  0,
                ) ?? 0;

              return (
                <Fragment key={booking.id}>
                  <div className="rounded-xl py-4 pt-1.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2sm font-medium text-foreground/70 md:text-sm">
                          Booking Id: {booking.id}
                        </span>
                        <span className="text-2sm font-semibold text-foreground/70 md:text-sm">
                          Total: <Price className="inline" price={total} />
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Link
                          href={centerUrl}
                          className="flex cursor-pointer flex-nowrap items-center gap-1 hover:opacity-80"
                        >
                          <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
                            {booking?.center?.name}
                          </h3>
                        </Link>
                        <span
                          className={`text-sm font-bold capitalize md:text-base ${BOOKING_STATUS[booking.status].textColor}`}
                        >
                          {BOOKING_STATUS[booking.status].name}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-muted px-2.5 py-1.5">
                      {/* <Label className="text-xs text-foreground/80">Services</Label> */}
                      <BookingItems
                        items={booking?.items as unknown as Items}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/2 cursor-pointer">
                      <CancelBookingButton />
                    </div>
                    <Link href={centerUrl} className="w-1/2 cursor-pointer">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full space-x-0.5"
                      >
                        <span>Rebook</span>
                        <TbReload className="size-3.5" strokeWidth={2.5} />
                      </Button>
                    </Link>
                  </div>

                  <hr className="my-5 border-foreground/20" />
                </Fragment>
              );
            })}
          </>
        ) : (
          <div className="flex h-20 items-center justify-center text-center text-foreground/80">
            <span>No Bookings Yet!</span>
          </div>
        )}
      </div>
    </div>
  );
}

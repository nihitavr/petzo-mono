import { Suspense } from "react";

import BookingTypeBar from "./_components/booking-type-bar";
import Bookings from "./_components/bookings";
import Loading from "./loading";

export default async function Page({
  params: { centerPublicId },
  searchParams: { type },
}: {
  params: { centerPublicId: string };
  searchParams: { type: string };
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Your Bookings */}
      <div className="sticky top-14 z-10 -mt-3.5 flex flex-col gap-2 bg-background pt-2  md:-mt-2">
        <h1 className="text-lg font-semibold">
          Bookings (<span className="capitalize">{type}</span>)
        </h1>
        <div className="no-scrollbar -mt-1 overflow-auto">
          <BookingTypeBar selectedType={type} centerPublicId={centerPublicId} />
        </div>
        <hr />
      </div>
      <Suspense key={`booking-type-${type}`} fallback={<Loading />}>
        <Bookings centerPublicId={centerPublicId} type={type} />
      </Suspense>
    </div>
  );
}

import Link from "next/link";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiCheckCircle } from "react-icons/fi";
import { IoTodayOutline } from "react-icons/io5";
import { RiInformationFill } from "react-icons/ri";
import { VscServerProcess } from "react-icons/vsc";

import { auth } from "@petzo/auth-center-app";
import { Button } from "@petzo/ui/components/button";
import Unauthorised from "@petzo/ui/components/errors/unauthorised";

import SignIn from "~/app/_components/sign-in";
import { api } from "~/trpc/server";

export default async function Page({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  if (!(await auth())?.user) {
    return (
      <Unauthorised
        comp={
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-base">
              Please <span className="font-semibold">Sign In</span> to view
              center dashboard.
            </span>
            <SignIn />
          </div>
        }
      />
    );
  }

  // You can await this here if you don't want to show Suspense fallback below
  const stats = await api.booking.getDashboardBookingStats({
    centerPublicId,
  });

  const hasAnyService = await api.center.doesAnyServiceExist({
    centerPublicId,
  });

  const center = await api.center.getCenter({
    centerPublicId,
  });

  const centerUrl = `/dashboard/${centerPublicId}`;

  return (
    <div className="flex flex-col gap-2">
      {/* Your Bookings */}
      {/* <div className="sticky top-14 z-10 -mt-3.5 bg-background pt-2 md:-mt-2">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div> */}
      <div className="py-3 text-center text-xl font-semibold md:text-2xl">
        <span className="block md:inline">Here&apos;s an overview of</span>{" "}
        <span className="block md:inline">your bookings for Today!</span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <DashboardItem
          title="Today"
          link={`${centerUrl}/bookings?type=today`}
          Icon={IoTodayOutline}
          iconColor="text-green-700"
          iconBackgroundColor="bg-green-600/15"
          total={stats.today}
        />
        <DashboardItem
          title="New"
          link={`${centerUrl}/bookings?type=new`}
          iconColor="text-red-800"
          iconBackgroundColor="bg-red-600/15"
          Icon={AiOutlineExclamationCircle}
          total={stats.new}
          animateIcon={!!stats.new && stats.new > 0}
        />
        <DashboardItem
          title="Active"
          link={`${centerUrl}/bookings?type=active`}
          Icon={VscServerProcess}
          iconColor="text-purple-800"
          iconBackgroundColor="bg-purple-600/15"
          total={stats.active}
        />
        <DashboardItem
          title="Completed"
          link={`${centerUrl}/bookings?type=completed`}
          iconColor="text-blue-500"
          iconBackgroundColor="bg-blue-600/15"
          Icon={FiCheckCircle}
          total={stats.completed}
        />
      </div>

      {!center?.centerAddressId && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-2">
          <div className="flex items-center justify-center gap-1 text-center text-sm font-medium text-foreground/70">
            <span className="text-center">
              <RiInformationFill className="inline size-5 h-min animate-bounce text-red-800" />{" "}
              Seems like you haven&apos;t added address yet. Click{" "}
              <span className="font-bold">Add New Address.</span>
            </span>{" "}
          </div>

          <Link
            href={`/dashboard/${centerPublicId}/address/create?onboarding=true`}
          >
            <Button
              variant="primary"
              size={"sm"}
              className="flex items-center justify-center gap-1"
            >
              Add Address
            </Button>
          </Link>
        </div>
      )}

      {!hasAnyService && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-2">
          <div className="flex items-center justify-center gap-1 text-center text-sm font-medium text-foreground/70">
            <span className="text-center">
              <RiInformationFill className="inline size-5 h-min animate-bounce text-red-800" />{" "}
              Seems like you haven&apos;t added any service yet. Click{" "}
              <span className="font-bold">Add New Service.</span>
            </span>{" "}
          </div>

          <Link
            href={`/dashboard/${centerPublicId}/services/create?onboarding=true`}
          >
            <Button
              variant="primary"
              size={"sm"}
              className="flex items-center justify-center gap-1"
            >
              Add New Service
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

const DashboardItem = ({
  title,
  link,
  total,
  Icon,
  iconColor,
  iconBackgroundColor,
  animateIcon,
}: {
  title: string;
  link: string;
  total?: number;
  Icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  iconColor?: string;
  iconBackgroundColor?: string;
  animateIcon?: boolean;
}) => {
  return (
    <Link
      href={link}
      className={`${iconBackgroundColor} flex aspect-square flex-col gap-1 rounded-2xl border p-2 shadow-md transition-all duration-200 ease-in-out hover:scale-105`}
    >
      <div className="flex items-center gap-1">
        <div
          className={`relative shrink-0 rounded-full p-1 ${iconBackgroundColor}`}
        >
          <Icon
            className={`size-6 shrink-0 p-0 text-foreground/70 opacity-80 ${iconColor}`}
          />

          {animateIcon && (
            <Icon
              className={`absolute top-1 size-6 shrink-0  animate-ping p-0 text-foreground/70 opacity-80 ${iconColor}`}
            />
          )}
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>

      <div className="flex flex-grow items-center justify-center text-center text-lg font-semibold">
        <span className="-translate-y-3 text-3xl text-foreground/80">
          {total ? total?.toLocaleString() : "-"}
        </span>
      </div>
    </Link>
  );
};

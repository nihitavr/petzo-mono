import Link from "next/link";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiCheckCircle } from "react-icons/fi";
import { IoTodayOutline } from "react-icons/io5";
import { VscServerProcess } from "react-icons/vsc";

import { api } from "~/trpc/server";

export default async function Page({
  params: { centerPublicId },
}: {
  params: { centerPublicId: string };
}) {
  // You can await this here if you don't want to show Suspense fallback below
  const stats = await api.booking.getDashboardBookingStats({
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
        <span className="block md:inline">your bookings for the day!</span>
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
          link={`${centerUrl}/bookings?type=ongoing`}
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

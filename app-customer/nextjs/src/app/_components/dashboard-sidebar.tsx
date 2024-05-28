"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaAddressCard,
  FaCalendarAlt,
  FaDog,
  FaUserCircle,
} from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="text-lg font-semibold">Dashboard</h3>
      <div className="flex flex-col gap-3">
        <NavItem
          href="/dashboard/profile"
          text="Your Profile"
          Icon={FaUserCircle}
          isSelected={pathname == "/dashboard/profile"}
        />
        <NavItem
          href="/dashboard/addresses"
          text="Addresses"
          Icon={FaAddressCard}
          isSelected={pathname == "/dashboard/addresses"}
        />
        <hr />
        <NavItem
          href="/dashboard/bookings"
          text="Bookings"
          Icon={FaCalendarAlt}
          isSelected={pathname == "/dashboard/bookings"}
        />
        <hr />
        <NavItem
          href="/dashboard/pets"
          text="Your Pets"
          Icon={FaDog}
          isSelected={
            pathname.startsWith("/dashboard/pets") &&
            !pathname.includes("/medical-records")
          }
        />
        <NavItem
          href="/dashboard/medical-records"
          text="Medical Records"
          Icon={HiDocumentText}
          isSelected={pathname.startsWith("/medical-records")}
        />
      </div>
    </div>
  );
}

const NavItem = ({
  href,
  text,
  Icon,
  isSelected,
}: {
  href: string;
  text: string;
  Icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  isSelected: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${isSelected ? "bg-secondary" : ""}`}
    >
      <Icon className="size-6 text-foreground/70" />
      <span>{text}</span>
    </Link>
  );
};

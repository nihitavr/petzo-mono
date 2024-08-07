"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";
import { AiFillShop } from "react-icons/ai";
import { FaAddressCard, FaCalendarAlt } from "react-icons/fa";
import { TbLayoutDashboardFilled } from "react-icons/tb";

import { selectedCenterPublicId } from "~/lib/store/global-storage";

export default function DashboardSidebar() {
  useSignals();

  const pathname = usePathname();

  const centerUrl = `/dashboard/${selectedCenterPublicId.value}`;

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="text-lg font-semibold">Dashboard</h3>
      <div className="flex flex-col gap-2">
        <NavItem
          href={`${centerUrl}`}
          text="Dashboard"
          Icon={TbLayoutDashboardFilled}
          isSelected={pathname === `${centerUrl}`}
        />
        <hr />
        <NavItem
          href={`${centerUrl}/bookings?type=new`}
          text="Bookings"
          Icon={FaCalendarAlt}
          isSelected={pathname.startsWith(`${centerUrl}/bookings`)}
        />
        <hr />
        <NavItem
          href={`${centerUrl}/services`}
          text="Services"
          Icon={FaAddressCard}
          isSelected={pathname.startsWith(`${centerUrl}/services`)}
        />
        <hr />
        <NavItem
          href={`${centerUrl}/manage`}
          text="Manage Center"
          Icon={AiFillShop}
          isSelected={[
            `${centerUrl}/manage`,
            `${centerUrl}/edit`,
            `${centerUrl}/address/edit`,
          ].includes(pathname)}
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
      className={`flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-secondary ${isSelected ? "bg-secondary" : ""}`}
    >
      <Icon className="size-6 text-foreground/70" />
      <span>{text}</span>
    </Link>
  );
};

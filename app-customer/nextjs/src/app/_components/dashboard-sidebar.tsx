"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCalendarAlt, FaDog, FaUserCircle } from "react-icons/fa";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col gap-3">
      <h3 className="text-lg font-semibold">Dashboard</h3>
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/profile"
          className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${pathname.startsWith("/dashboard/profile") ? "bg-secondary" : ""}`}
        >
          <FaUserCircle
            className="h-8 w-8 text-foreground/70"
            strokeWidth={1.3}
          />
          <span>Your Profile</span>
        </Link>
        <Link
          href="/dashboard/pets"
          className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${pathname.startsWith("/dashboard/pets") && !pathname.includes("/medical-records") ? "bg-secondary" : ""}`}
        >
          <FaDog className="h-8 w-8 text-foreground/70" strokeWidth={1.3} />
          <span>Your Pets</span>
        </Link>

        <Link
          href="/dashboard/medical-records"
          className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${pathname.includes("/medical-records") ? "bg-secondary" : ""}`}
        >
          <FaCalendarAlt
            className="h-8 w-8 text-foreground/70"
            strokeWidth={1.3}
          />
          <span>Medical Records</span>
        </Link>
      </div>
    </div>
  );
}

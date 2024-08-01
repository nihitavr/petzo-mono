"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPersonFill } from "react-icons/bs";
import {
  FaAddressCard,
  FaCalendarAlt,
  FaDog,
  FaUserCircle,
} from "react-icons/fa";
import { HiDocumentText } from "react-icons/hi";

import { Avatar, AvatarFallback } from "@petzo/ui/components/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@petzo/ui/components/sheet";
import { ThemeToggle } from "@petzo/ui/components/theme";

import SignIn from "./sign-in";
import SignOut from "./sign-out";

export function SideNavSheet({
  isSignedIn,
  image,
  fallbackLetter,
}: {
  isSignedIn: boolean;
  image?: string | null;
  fallbackLetter?: string;
}) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="cursor-pointer hover:opacity-90">
          {image ? (
            <Image src={image} alt="Avatar" width={50} height={50} />
          ) : (
            <AvatarFallback className="">
              {fallbackLetter ?? (
                <BsPersonFill className="size-7 text-foreground/70" />
              )}
            </AvatarFallback>
          )}
        </Avatar>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <div className="flex flex-row items-center">
            <div className="relative h-10 w-40 dark:hidden">
              <Image
                src="/website/furclub-logo.svg"
                alt="Logo"
                className="rounded-lg"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div className="relative hidden h-10 w-40 dark:inline-block">
              <Image
                src="/website/furclub-logo-dark.svg"
                alt="Logo"
                className="rounded-lg"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </SheetHeader>
        <div className="mt-5 flex flex-col gap-2">
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
        <SheetFooter className="mt-8">
          {isSignedIn ? (
            <SheetClose asChild>
              <SignOut />
            </SheetClose>
          ) : (
            <SignIn />
          )}
        </SheetFooter>

        <div className="absolute bottom-8 right-5 flex flex-col items-end gap-4">
          <SheetClose asChild>
            <Link href={"/for-partners"} className="font-semibold md:hidden">
              For Partners
            </Link>
          </SheetClose>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
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
    <SheetClose asChild>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-secondary ${isSelected ? "bg-secondary" : ""}`}
      >
        <Icon className="size-6 text-foreground/70" />
        <span>{text}</span>
      </Link>
    </SheetClose>
  );
};

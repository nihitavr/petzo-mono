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
        <SheetHeader className="flex flex-row gap-2">
          <div className="relative h-12 w-36">
            <Image
              src="/petzo-logo.svg"
              alt="Logo"
              className="rounded-lg"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </SheetHeader>
        <div className="mt-5 flex flex-col gap-2">
          <SheetClose asChild>
            <NavItem
              href="/dashboard/profile"
              text="Your Profile"
              Icon={FaUserCircle}
              isSelected={pathname == "/dashboard/profile"}
            />
          </SheetClose>
          <SheetClose asChild>
            <NavItem
              href="/dashboard/addresses"
              text="Addresses"
              Icon={FaAddressCard}
              isSelected={pathname == "/dashboard/addresses"}
            />
          </SheetClose>
          <hr />
          <SheetClose asChild>
            <NavItem
              href="/dashboard/bookings"
              text="Bookings"
              Icon={FaCalendarAlt}
              isSelected={pathname == "/dashboard/bookings"}
            />
          </SheetClose>
          <hr />

          <SheetClose asChild>
            <NavItem
              href="/dashboard/pets"
              text="Your Pets"
              Icon={FaDog}
              isSelected={
                pathname.startsWith("/dashboard/pets") &&
                !pathname.includes("/medical-records")
              }
            />
          </SheetClose>
          <SheetClose asChild>
            <NavItem
              href="/dashboard/medical-records"
              text="Medical Records"
              Icon={HiDocumentText}
              isSelected={pathname.startsWith("/medical-records")}
            />
          </SheetClose>
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

        <div className="absolute bottom-8 right-5">
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
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${isSelected ? "bg-secondary" : ""}`}
    >
      <Icon className="size-6 text-foreground/70" />
      <span>{text}</span>
    </Link>
  );
};

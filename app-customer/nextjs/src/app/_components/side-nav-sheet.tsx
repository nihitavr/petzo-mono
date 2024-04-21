"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsPersonFill } from "react-icons/bs";
import { FaCalendarAlt, FaDog, FaUserCircle } from "react-icons/fa";

import { Avatar, AvatarFallback } from "@petzo/ui/components/avatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@petzo/ui/components/sheet";

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
            />
          </div>
        </SheetHeader>
        <div className="mt-5 flex flex-col gap-5">
          <SheetClose asChild>
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${pathname.startsWith("/dashboard/pets") && !pathname.includes("/medical-records") ? "bg-secondary" : ""}`}
            >
              <FaUserCircle
                className="h-8 w-8 text-foreground/70"
                strokeWidth={1.3}
              />
              <span>Your Profile</span>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/dashboard/pets"
              className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${pathname.startsWith("/dashboard/pets") && !pathname.includes("/medical-records") ? "bg-secondary" : ""}`}
            >
              <FaDog className="h-8 w-8 text-foreground/70" strokeWidth={1.3} />
              <span>Your Pets</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/dashboard/medical-records"
              className={`flex items-center gap-3 rounded-md p-2 hover:bg-secondary ${pathname.endsWith("/medical-records") ? "bg-secondary" : ""}`}
            >
              <FaCalendarAlt
                className="h-8 w-8 text-foreground/70"
                strokeWidth={1.3}
              />
              <span>Medical Records</span>
            </Link>
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
      </SheetContent>
    </Sheet>
  );
}

import Image from "next/image";
import Link from "next/link";
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
  fallbackLetter: string;
}) {
  return (
    <Sheet>
      {isSignedIn ? (
        <SheetTrigger asChild>
          <Avatar className="cursor-pointer hover:opacity-90">
            {image ? (
              <Image src={image} alt="Avatar" width={50} height={50} />
            ) : (
              <AvatarFallback>{fallbackLetter}</AvatarFallback>
            )}
          </Avatar>
        </SheetTrigger>
      ) : (
        <SignIn />
      )}
      <SheetContent>
        <SheetHeader className="flex flex-row gap-2">
          <div className="relative h-12 w-40">
            <Image
              src="/petzo-logo.svg"
              alt="Logo"
              className="rounded-lg"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </SheetHeader>
        <div className="mt-8 flex flex-col gap-5">
          <SheetClose asChild>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary"
            >
              <FaUserCircle className="h-8 w-8" strokeWidth={1.3} />
              <span>Your Profile</span>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              href="/dashboard/pets"
              className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary"
            >
              <FaDog className="h-8 w-8" strokeWidth={1.3} />
              <span>Your Pets</span>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary"
            >
              <FaCalendarAlt className="h-8 w-8" strokeWidth={1.3} />
              <span>Bookings</span>
            </Link>
          </SheetClose>
        </div>
        <SheetFooter className="mt-8">
          <SheetClose asChild>
            <SignOut />
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

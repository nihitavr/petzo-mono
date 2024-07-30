"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { RiInformationFill } from "react-icons/ri";

export default function BookingTypeBar({
  selectedType,
  centerPublicId,
}: {
  selectedType: string;
  centerPublicId: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <BookingTypeButton
        name="Today"
        value="today"
        // textColor="text-yellow-600"
        selectedType={selectedType}
        centerPublicId={centerPublicId}
      />
      <BookingTypeButton
        name="New"
        value="new"
        // textColor="text-blue-700"
        selectedType={selectedType}
        centerPublicId={centerPublicId}
      />
      <BookingTypeButton
        name="Active"
        value="active"
        // textColor="text-amber-700"
        selectedType={selectedType}
        centerPublicId={centerPublicId}
      />
      <BookingTypeButton
        name="Upcoming"
        value="upcoming"
        // textColor="text-violet-700"
        selectedType={selectedType}
        centerPublicId={centerPublicId}
      />
      <BookingTypeButton
        name="Completed"
        value="completed"
        // textColor="text-green-700"
        selectedType={selectedType}
        centerPublicId={centerPublicId}
      />
      <BookingTypeButton
        name="Cancelled"
        value="cancelled"
        // textColor="text-red-700"
        selectedType={selectedType}
        centerPublicId={centerPublicId}
      />
    </div>
  );
}

const BookingTypeButton = ({
  name,
  value,
  selectedType,
  centerPublicId,
}: {
  name: string;
  value: string;
  selectedType: string;
  centerPublicId: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleClick = () => {
    ref?.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  useEffect(() => {
    if (selectedType == value) {
      handleClick();
    }
  }, [selectedType]);

  const isSelected = value === selectedType;
  return (
    <Link
      ref={ref}
      // onClick={handleClick}
      href={`/dashboard/${centerPublicId}/bookings?type=${value}`}
      className={`flex w-28 items-center justify-center gap-1 whitespace-nowrap rounded-md border-[1.3px] px-2 py-1 text-center md:hover:bg-primary/20 ${isSelected ? "bg-primary text-primary-foreground md:hover:bg-primary/90" : ""}`}
    >
      <span>{name}</span>
    </Link>
  );
};

export const BookingTypeInfo = ({ selectedType }: { selectedType: string }) => {
  let message = "";

  if (selectedType == "today") {
    message = "Bookings that are scheduled for today";
  } else if (selectedType == "new") {
    message = "New bookings that need to be accepted";
  } else if (selectedType == "active") {
    message = "Bookings that are currently in progress";
  } else if (selectedType == "upcoming") {
    message = "Accepted Bookings that are scheduled for a future date";
  } else if (selectedType == "completed") {
    message = "Completed bookings";
  } else if (selectedType == "cancelled") {
    message = "Cancelled bookings";
  }

  return (
    <div className="flex items-start justify-center gap-1 text-center text-sm font-medium text-foreground/70">
      <RiInformationFill className="text-blue-500" size={20} />{" "}
      <span>{message}</span>
    </div>
  );
};

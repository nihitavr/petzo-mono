"use client";

import Image from "next/image";
import Link from "next/link";

import { toast } from "@petzo/ui/components/toast";

const HomePageServicesCard = ({
  name,
  label,
  imageUrl,
  link,
  disabled,
  disabledToastText,
}: {
  name: string;
  label?: string;
  imageUrl: string;
  link: string;
  disabled?: boolean;
  disabledToastText?: string;
}) => {
  return (
    <Link
      href={link}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          toast.info(disabledToastText ?? "This service is coming soon...");
        }
      }}
      className={`relative m-auto flex aspect-square w-full
      flex-col overflow-hidden rounded-2xl border p-3 transition-transform
      duration-200 ease-in-out md:p-4 ${disabled ? "opacity-50 dark:opacity-50" : "group hover:scale-105"}`}
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        style={{ objectFit: "contain" }}
        className="z-10 transition-transform duration-200 ease-in-out group-hover:scale-105"
      />
      <div className={`absolute left-0 top-0 size-full bg-muted`}></div>
      <h2 className="z-10 font-semibold md:text-xl">{name}</h2>
      {label && (
        <span className="z-10 -mt-1 text-xs opacity-60 md:text-sm">
          {label}
        </span>
      )}
      {disabled && (
        <div className="absolute bottom-0 left-0 z-20 w-full border-t bg-background py-1 text-center text-xs font-semibold">
          Coming soon...
        </div>
      )}
    </Link>
  );
};

export default HomePageServicesCard;

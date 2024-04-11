"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Session } from "@petzo/auth-customer-app";
import { cn } from "@petzo/ui/lib/utils";

import CityDropdown from "./city-dropdown";
import GlobalSearchInput from "./global-search-input";
// import { CartSideSheet } from "./cart-side-sheet";
import { SideNavSheet } from "./side-nav-sheet";

export default function Header({
  session,
  cities,
}: {
  session: Session | null;
  cities: {
    name: string;
    publicId: string;
  }[];
}) {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > lastScrollTop && currentScrollPos > 50) {
      // Scroll Up
      setHeaderVisible(false);
    } else if (lastScrollTop - currentScrollPos > 5 || currentScrollPos < 100) {
      // Scroll Down
      setHeaderVisible(true);
    }

    setLastScrollTop(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-50 w-full border-b bg-background px-3 py-2 shadow-sm md:py-2 lg:px-24 xl:px-48",
        headerVisible
          ? "translate-y-0 transition-transform duration-300 ease-in-out"
          : "-translate-y-full transition-transform duration-300 ease-in-out",
      )}
    >
      <nav className="bg-header flex items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-4 md:flex-row">
          <Link href="/">
            <div className="relative h-10 w-28 md:w-24">
              {/* <div className="relative h-12 w-44"> */}
              <Image
                src="/petzo-logo.svg"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                className="w-min"
              />
            </div>
          </Link>
        </div>
        <div className="hidden md:inline">
          <GlobalSearchInput />
        </div>

        <div className="flex items-center gap-2">
          {/* <CartSideSheet /> */}
          <CityDropdown cities={cities} />
          <SideNavSheet
            isSignedIn={!!session?.user}
            image={session?.user?.image}
            fallbackLetter={session?.user?.name?.[0] ?? "A"}
          />
        </div>
      </nav>
    </header>
  );
}

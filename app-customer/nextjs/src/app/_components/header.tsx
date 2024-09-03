"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";

import type { Session } from "@petzo/auth-customer-app";
import type { City } from "@petzo/db";
import { Button } from "@petzo/ui/components/button";
import { cn } from "@petzo/ui/lib/utils";

import { filtersStore } from "~/lib/storage/global-storage";
import CityDropdown from "./city-dropdown";
import GlobalSearchInput from "./global-search-input";
// import { CartSideSheet } from "./cart-side-sheet";
import { SideNavSheet } from "./side-nav-sheet";
import SignIn from "./sign-in";

export default function Header({
  session,
  cities,
}: {
  session: Session | null;
  cities: City[];
}) {
  useSignals();

  const pathname = usePathname();

  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const scrollUpThreshold =
      pathname.endsWith("/explore") || pathname.endsWith("/centers") ? 100 : 50;

    const scrollDownThreshold =
      pathname.endsWith("/explore") || pathname.endsWith("/centers") ? 100 : 50;

    if (
      currentScrollPos > lastScrollTop &&
      currentScrollPos > scrollUpThreshold &&
      !pathname.startsWith("/dashboard") &&
      !pathname.startsWith("/checkout") &&
      !pathname.startsWith("/partner-with-us")
    ) {
      // Scroll Up
      setHeaderVisible(false);
    } else if (
      lastScrollTop - currentScrollPos > 1 ||
      currentScrollPos < scrollDownThreshold
    ) {
      // Scroll Down
      setHeaderVisible(true);
    }

    setLastScrollTop(currentScrollPos);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-50 w-full bg-background",
        headerVisible
          ? "translate-y-0 transition-transform duration-300 ease-in-out"
          : "-translate-y-full transition-transform duration-300 ease-in-out",
      )}
    >
      <nav className="grid w-full grid-cols-2 gap-4 border-b px-3 py-2 shadow-sm md:grid-cols-3 lg:px-24 xl:px-48">
        <div className="flex items-center justify-start gap-4">
          <Link
            className="flex items-center"
            href={`/${filtersStore.city.value}/explore`}
            scroll={false}
          >
            <div className="relative h-10 w-40 dark:hidden">
              <Image
                src="/website/furclub-logo.svg"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                className="w-min"
                priority
              />
            </div>
            <div className="relative hidden h-10 w-40 dark:inline-block">
              <Image
                src="/website/furclub-logo-dark.svg"
                alt="Logo"
                fill
                style={{ objectFit: "contain" }}
                className="w-min"
                priority
              />
            </div>
          </Link>
        </div>
        <div className="hidden items-center justify-center md:flex">
          {!pathname.endsWith("/partner-with-us") && <GlobalSearchInput />}
        </div>

        <div className="flex items-center justify-end gap-2">
          {pathname.endsWith("/explore") && (
            <Link
              href={"/partner-with-us"}
              className="mr-2 hidden font-medium hover:text-foreground/80 md:inline"
            >
              For Partners
            </Link>
          )}
          {pathname.endsWith("/partner-with-us") && (
            <Link
              href={"#demo-section"}
              className="relative font-medium hover:text-foreground/80 md:mr-2 md:inline"
            >
              <Button
                size="sm"
                className="rounded-full px-2 text-2xs md:h-10 md:px-3 md:text-sm"
              >
                Get Free Demo
              </Button>
            </Link>
          )}
          {/* <CartSideSheet /> */}
          {!pathname.endsWith("/partner-with-us") && (
            <CityDropdown cities={cities} />
          )}

          {session?.user ? (
            <SideNavSheet
              isSignedIn={!!session?.user}
              image={session?.user?.image}
              fallbackLetter={session?.user?.name?.[0]}
            />
          ) : (
            <SignIn className="px-2 text-xs md:text-sm" />
          )}
        </div>
      </nav>

      {(pathname.startsWith(`/${filtersStore.city.value}/explore`) ||
        pathname.startsWith(`/${filtersStore.city.value}/centers`) ||
        pathname.startsWith(`/${filtersStore.city.value}/search`)) && (
        <div className="px-3 py-2 md:hidden md:pt-2">
          <GlobalSearchInput />
        </div>
      )}
    </header>
  );
}

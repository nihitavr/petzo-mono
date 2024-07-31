"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSignals } from "@preact/signals-react/runtime";

import type { Session } from "@petzo/auth-center-app";
import type { Center } from "@petzo/db";
import { cn } from "@petzo/ui/lib/utils";

import { selectedCenterPublicId } from "~/lib/store/global-storage";
import CentersDropdown from "./centers-dropdown";
import { SideNavSheet } from "./side-nav-sheet";

export default function Header({
  session,
  centers,
}: {
  session: Session | null;
  centers?: Center[];
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
      !pathname.startsWith("/checkout")
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
      <nav className="grid w-full grid-cols-2 gap-10 border-b px-3 py-2 shadow-sm md:grid-cols-3 lg:px-24 xl:px-48">
        <div className="flex items-center justify-start gap-4">
          <Link
            className="flex items-center"
            href={
              selectedCenterPublicId.value
                ? `/dashboard/${selectedCenterPublicId.value}`
                : `/`
            }
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
          {/* <GlobalSearchInput /> */}
        </div>

        <div className="flex items-center justify-end gap-1 md:gap-2">
          <CentersDropdown centers={centers} />

          <SideNavSheet
            isSignedIn={!!session?.user}
            image={session?.user?.image}
            fallbackLetter={session?.user?.name?.[0]}
          />
        </div>
      </nav>
    </header>
  );
}

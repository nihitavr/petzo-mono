import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@petzo/ui/components/theme";
import { Toaster } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { auth } from "@petzo/auth-customer-app";

import { api } from "~/trpc/server";
import Footer from "./_components/footer";
import Header from "./_components/header";
import ViewCartButton from "./_components/view-cart-button";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://petzo.co"
      : "http://localhost:3000",
  ),
  title: "Petzo",
  icons: [{ rel: "icon", url: "/petzo-logo-icon.svg" }],
  description:
    "Petzo | Book Vet Consultation, Pet Grooming and Pet boarding services online.",
  openGraph: {
    title: "Petzo",
    images: [{ url: "/petzo-logo-icon.svg" }],
    description:
      "Petzo is an online platform for booking Vet Consultation, Pet Grooming and Pet boarding services online from nearby centers. Also features Pet Profile, Pet Booking/Health records and more.",
    url: "https://petzo.co",
    siteName: "Petzo App",
  },
  twitter: {
    title: "Petzo",
    images: [{ url: "/petzo-logo-icon.svg" }],
    description:
      "Petzo is an online platform for booking Vet Consultation, Pet Grooming and Pet boarding services online. ",
    card: "summary_large_image",
    site: "@petzoapp",
    creator: "@petzoapp",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();
  const cities = await api.geography.getActiveCities();
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          "min-h-screen w-[100vw] overflow-y-scroll bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>
            <Header session={session} cities={cities} />
            <main className="px-3 py-[4.4rem] md:py-[4.8rem] lg:px-24 xl:px-48">
              {props.children}
            </main>
            <ViewCartButton />
            <Footer />
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

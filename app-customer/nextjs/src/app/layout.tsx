import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider, ThemeToggle } from "@petzo/ui/components/theme";
import { Toaster } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { auth } from "@petzo/auth-customer-app";

import { api } from "~/trpc/server";
import Header from "./_components/header";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://petzo.co"
      : "http://localhost:3000",
  ),
  title: "Petzo",
  icons: [{ rel: "icon", url: "/petzo-logo-icon.svg" }],
  description:
    "Petzo is a pet-care platform for pet owners and pet service providers.",
  openGraph: {
    title: "Petzo",
    description:
      "Petzo is a pet-care platform for pet owners and pet service providers.",
    url: "https://petzo.co",
    siteName: "Petzo App",
  },
  twitter: {
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
  const cities = await api.city.getAll();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>
            <Header session={session} cities={cities} />
            <main className="h-screen px-3 py-14 md:py-14 lg:px-24 xl:px-48">
              {props.children}
            </main>
          </TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

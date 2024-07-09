import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider, ThemeToggle } from "@petzo/ui/components/theme";
import { Toaster } from "@petzo/ui/components/toast";
import { cn } from "@petzo/ui/lib/utils";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://center.furclub.in"
      : "http://localhost:3000",
  ),
  title: "Furclub Center App",
  description: "Furclub is an online platform for booking Pet Home Grooming, Vet Consultation, Pet Grooming and Pet boarding services online from nearby centers.",
  openGraph: {
    title: "Furclub Center App",
    description: "Furclub is an online platform for booking Pet Home Grooming, Vet Consultation, Pet Grooming and Pet boarding services online from nearby centers.",
    url: "https://center.furclub.in",
    siteName: "Furclub Center App",
  },
  twitter: {
    card: "summary_large_image",
    site: "@furclubcenterapp",
    creator: "@furclub",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <div className="absolute bottom-4 right-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

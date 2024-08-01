"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuInstagram, LuMail, LuPhone } from "react-icons/lu";

export default function Footer() {
  const pathname = usePathname();

  if (pathname !== "/" && !pathname.includes("explore")) return null;

  return (
    <footer className="relative -mt-10 flex flex-col items-start justify-start gap-5 px-3 pb-20 md:justify-between md:pb-[4.8rem] lg:px-24 xl:px-48">
      <div className="flex w-full flex-col items-start justify-between gap-1 md:flex-row-reverse">
        <Link
          href={"/partner-with-us"}
          className="mr-2 font-medium hover:text-foreground/80"
        >
          For Partners
        </Link>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold">Company</h3>
          <Link
            className="mt-2 text-foreground/80 hover:text-foreground"
            href={"/privacy-policy.html"}
          >
            Privacy Policy
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={"/terms-and-conditions.html"}
          >
            Terms of Service
          </Link>
        </div>
      </div>

      <div className="flex w-full flex-col justify-between gap-2 md:flex-row md:items-end">
        {/* Instagram */}
        <div className="flex flex-col gap-1">
          <a
            className="flex w-min items-center justify-start gap-2  text-foreground hover:text-foreground/80"
            href="https://instagram.com/furclub.official"
            target="_blank"
            rel="noreferrer"
          >
            <LuInstagram className="mt-0.5 h-4 cursor-pointer" />
            <span>furclub.official</span>
          </a>

          {/* Email */}
          <div className="flex items-center gap-2">
            <LuMail className="mt-0.5 h-4" />
            <span>petzo.co@gmail.com</span>
          </div>

          {/* Phone num */}
          <div className="flex items-center gap-2">
            <LuPhone className="h-4" />
            <span>+91 6363822930</span>
          </div>
        </div>

        <div>
          <p className="mt-5 font-semibold">FURCLUB</p>
          <p>Copyright &copy; 2024 Furclub</p>
        </div>
      </div>
    </footer>
  );
}

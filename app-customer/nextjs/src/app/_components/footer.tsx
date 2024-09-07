"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuInstagram, LuMail, LuPhone } from "react-icons/lu";

export default function Footer({
  centerAppBaseUrl,
}: {
  centerAppBaseUrl: string;
}) {
  const pathname = usePathname();

  if (
    pathname !== "/" &&
    !pathname.includes("explore") &&
    pathname !== "/partner-with-us" &&
    !pathname.startsWith("/policies")
  )
    return null;

  return (
    <footer className="relative flex flex-col items-start justify-start gap-8 bg-muted px-3 pb-20 pt-10 md:justify-between md:pb-[5.8rem] lg:px-24 xl:px-48">
      <div className="mt-2 flex w-full grid-cols-4 flex-col items-start justify-between gap-5 md:grid md:gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">Vet Consultation</h3>
          <Link
            className="mt-1 text-foreground/80 hover:text-foreground"
            href={"/bengaluru/centers?serviceType=veterinary"}
          >
            Vet Consultation in Bengaluru
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=veterinary&area=hsr_layout_bengaluru"
            }
          >
            Vet Consultation in HSR Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=veterinary&area=koramangala_bengaluru"
            }
          >
            Vet Consultation in Koramangala
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=veterinary&area=btm_layout_bengaluru"
            }
          >
            Vet Consultation in BTM Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=veterinary&area=jp_nagar_bengaluru,j_p_nagar_bengaluru"
            }
          >
            Vet Consultation in JP Nagar
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">Instore Grooming</h3>
          <Link
            className="mt-1 text-foreground/80 hover:text-foreground"
            href={"/bengaluru/centers?serviceType=grooming"}
          >
            Grooming in Bengaluru
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=grooming&area=hsr_layout_bengaluru"
            }
          >
            Grooming in HSR Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=grooming&area=koramangala_bengaluru"
            }
          >
            Grooming in Koramangala
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=grooming&area=btm_layout_bengaluru"
            }
          >
            Grooming in BTM Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=grooming&area=jp_nagar_bengaluru,j_p_nagar_bengaluru"
            }
          >
            Grooming in JP Nagar
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">Home Grooming</h3>
          <Link
            className="mt-1 text-foreground/80 hover:text-foreground"
            href={"/bengaluru/centers?serviceType=home_grooming"}
          >
            Home Grooming in Bengaluru
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=home_grooming&area=hsr_layout_bengaluru"
            }
          >
            Home Grooming in HSR Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=home_grooming&area=koramangala_bengaluru"
            }
          >
            Home Grooming in Koramangala
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=home_grooming&area=btm_layout_bengaluru"
            }
          >
            Home Grooming in BTM Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=home_grooming&area=jp_nagar_bengaluru,j_p_nagar_bengaluru"
            }
          >
            Home Grooming in JP Nagar
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">Pet Boarding</h3>
          <Link
            className="mt-1 text-foreground/80 hover:text-foreground"
            href={"/bengaluru/centers?serviceType=boarding"}
          >
            Pet Boarding in Bengaluru
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=boarding&area=hsr_layout_bengaluru"
            }
          >
            Pet Boarding in HSR Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=boarding&area=koramangala_bengaluru"
            }
          >
            Pet Boarding in Koramangala
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=boarding&area=btm_layout_bengaluru"
            }
          >
            Pet Boarding in BTM Layout
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={
              "/bengaluru/centers?serviceType=boarding&area=jp_nagar_bengaluru,j_p_nagar_bengaluru"
            }
          >
            Pet Boarding in JP Nagar
          </Link>
        </div>
      </div>

      <div className="flex w-full grid-cols-4 flex-col justify-between gap-5 md:grid md:gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">For Partners</h3>
          <Link
            href={"/partner-with-us"}
            className="mt-1 text-foreground/80 hover:text-foreground"
          >
            See Benefits
          </Link>
          <a
            href={`${centerAppBaseUrl}`}
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 hover:text-foreground"
          >
            Register your center
          </a>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold">Company</h3>
          <Link
            className="mt-2 text-foreground/80 hover:text-foreground"
            href={"/policies/privacy-policy"}
          >
            Privacy Policy
          </Link>
          <Link
            className="text-foreground/80 hover:text-foreground"
            href={"/policies/terms-and-conditions"}
          >
            Terms of Service
          </Link>
        </div>
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
            <span>furclub.official@gmail.com</span>
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

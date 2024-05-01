import Link from "next/link";
import { LuInstagram, LuMail, LuPhone } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="relative flex flex-col-reverse items-start justify-start gap-5 px-3 pb-8  md:flex-row md:justify-between md:pb-[4.8rem] lg:px-24 xl:px-48">
      <div className="flex flex-col gap-2">
        {/* Instagram */}
        <a
          className="flex w-min items-center justify-start gap-2  text-foreground hover:text-foreground/80"
          href="https://instagram.com/petzo.co"
          target="_blank"
          rel="noreferrer"
        >
          <LuInstagram className="h-4 cursor-pointer" />
          <span>petzo.co</span>
        </a>

        {/* Email */}
        <div className="flex items-center gap-2">
          <LuMail className="h-4" />
          <span>petzo.co@gmail.com</span>
        </div>

        {/* Phone num */}
        <div className="flex items-center gap-2">
          <LuPhone className="h-4" />
          <span>+91 6363822930</span>
        </div>

        <p className="mt-5 font-semibold">Petzo</p>
        <p>Copyright &copy; 2024 Petzo</p>
      </div>
      <div className="flex w-60 flex-col items-start gap-1">
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
    </footer>
  );
}

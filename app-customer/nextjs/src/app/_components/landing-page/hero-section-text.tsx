import WipeAnimation from "@petzo/ui/components/animation/wipe-animation";

export default function HeroSectionText() {
  return (
    <div className="flex w-full flex-col items-center">
      <WipeAnimation
        animationDuration={1.5}
        animationDelay={0}
        className="text-center text-xl opacity-0 md:text-2xl"
      >
        Discover the best
        <span className="hidden md:inline">
          <span className="bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text font-semibold text-transparent">
            {" "}
            pet care centers
          </span>{" "}
          in your city.
        </span>
      </WipeAnimation>
      <WipeAnimation
        animationDuration={1.5}
        animationDelay={1}
        className="-mt-1 text-center text-xl opacity-0 md:hidden md:text-2xl"
      >
        <span className="bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text font-semibold text-transparent">
          pet care centers
        </span>{" "}
        in your city.
      </WipeAnimation>
    </div>
  );
}

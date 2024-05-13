import { TypewriterEffectSmooth } from "@petzo/ui/components/animation/typewriter-effect";

export default function HeroSectionText({ city }: { city: string }) {
  const wordsDesktop = [
    { text: "Discover" },
    { text: "the" },
    { text: "best" },
    {
      text: "pet care",
      className:
        "bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent font-semibold",
    },
    { text: `in ${city}` },
  ];

  const wordsMobile = [
    [{ text: "Discover" }, { text: "the" }, { text: "best" }],
    [
      {
        text: "pet care",
        className:
          "bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent font-semibold",
      },
      { text: `in ${city}.` },
    ],
  ];

  return (
    <div className="py-3">
      <div className="flex w-full flex-col items-center md:hidden">
        <TypewriterEffectSmooth
          className="text-2xl"
          duration={0.8}
          startDelay={0}
          words={
            wordsMobile[0] as unknown as { text: string; className?: string }[]
          }
          cursorClassName="w-0"
        />

        <TypewriterEffectSmooth
          className="text-2xl"
          cursorClassName="w-0"
          duration={1}
          startDelay={0.8}
          words={
            wordsMobile[1] as unknown as { text: string; className?: string }[]
          }
        />
      </div>

      <div className="hidden w-full items-center justify-center gap-1 md:flex">
        <TypewriterEffectSmooth
          duration={1.5}
          className="py-0 text-3xl"
          words={wordsDesktop}
          cursorClassName="w-0"
        />
      </div>
    </div>
  );
}

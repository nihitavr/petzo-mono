import type { ReactNode } from "react";

const MESSAGES = [
  "Paws right there! You need a purr-mission slip to get through this cat flap.",
  "You must be kitten me! You need to be part of the pack to see this content.",
  "This doghouse is members-only. Please fetch the right credentials.",
  "You're barking up the wrong tree without proper credentials.",
  "Looks like you're chasing your tail. You need to be part of the pack to see this content.",
];

export default function Unauthorised({ comp }: { comp?: ReactNode }) {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-2">
      <span className="text-center text-2xl font-medium text-primary">
        Oops... 401: Unauthorised
      </span>

      <div className="px-3 text-center text-xl">
        {comp ? comp : MESSAGES[Math.floor(Math.random() * MESSAGES.length)]}
      </div>
    </div>
  );
}

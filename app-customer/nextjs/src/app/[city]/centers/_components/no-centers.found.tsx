"use client";

import { useSignals } from "@preact/signals-react/runtime";

export default function NoCentersFound() {
  useSignals();

  return (
    <div className="flex h-[60vh] items-center justify-center text-xl font-semibold opacity-70">
      <span>Oops... No Centers Found</span>
    </div>
  );
}

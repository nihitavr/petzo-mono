"use client";

import * as React from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa6";

import { Label } from "./label";

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div>
      {theme == "dark" ? (
        <div className="flex items-center gap-2">
          <Label className="font-semibold">{"Dark Mode"}</Label>
          <FaSun
            onClick={() => setTheme("light")}
            className="size-9 cursor-pointer rounded-md border-2 p-1.5 text-foreground/70"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Label className="font-semibold">{"Light Mode"}</Label>
          <FaMoon
            onClick={() => setTheme("dark")}
            className="size-9 cursor-pointer rounded-md border p-1.5 text-foreground/70"
          />
        </div>
      )}
    </div>
  );
}

export { ThemeProvider, ThemeToggle };

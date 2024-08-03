import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

import base from "./base";

export default {
  content: base.content,
  presets: [base],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        "2sm": ["0.82rem", "1.15rem"],
        "2xs": ["0.7rem", "1rem"],
        "3xs": ["0.65rem", "1rem"],
      },
      boxShadow: {
        "m-xl": "0 0px 13px -1px rgba(0, 0, 0, 0.5)",
        "m-lg": "0 0px 10px -1px rgba(0, 0, 0, 0.5)",
        "m-md": "0 0px 7px -1px rgba(0, 0, 0, 0.5)",
        "m-sm": "0 0px 5px -1.5px rgba(0, 0, 0, 0.5)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "text-color-gradient": {
          "0% 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "120% 50%",
          },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0", display: "none" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "wipe-left-right": {
          "0%": { width: "0", opacity: "100%" },
          "100%": { width: "100%", opacity: "100%" },
        },
        "wipe-bottom-up": {
          "0%": { transform: "translateY(100%)" },
          "25%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(0%)" },
          "75%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        border: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "meteor-effect": "meteor 5s linear infinite",
        "wipe-bottom-up": "wipe-bottom-up 1s linear",
        "wipe-left-right": "wipe-left-right 1s linear",
        "wipe-show-down": "wipe-show-down 3s ease-out infinite",
        "fade-out": "fade-out 0.2s ease-out forwards",
        "fade-in": "fade-in 0.2s ease-out forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        border: "border 4s ease infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "text-color-gradient": "text-color-gradient 2s",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

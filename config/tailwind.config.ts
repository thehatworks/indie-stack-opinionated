import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  // include !important with every rule, lol
  important: true,
  // jit-mode for custom on-demand utilities
  mode: "jit",
  content: ["../app/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: ["dark", "light"],
  },
  theme: {
    extend: {
      spacing: {
        icon: "1.5rem",
      },
    },
    fontFamily: {
      sans: ['"Exo 2"', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [require("daisyui")],
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    relativeContentPathsByDefault: true,
  },
} satisfies Config;

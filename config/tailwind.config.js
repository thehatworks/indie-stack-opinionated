const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // include !important with every rule, lol
  important: true,
  // jit-mode for custom on-demand utilities
  mode: "jit",
  // match for compiler to detect used classes
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  // prevent tailwind from purging daisui-react styles
  safelist: [
    {
      pattern: /./,
    },
  ],
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
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  plugins: [require("daisyui")],
  future: {
    removeDeprecatedGapUtilities: true,
    defaultLineHeights: true,
    standardFontWeights: true,
    purgeLayersByDefault: true,
  },
};

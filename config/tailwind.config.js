const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  // include !important with every rule, lol
  important: true,
  // jit-mode for custom on-demand utilities
  mode: "jit",
  // match for compiler to detect used classes
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      sans: ['"Exo 2"', ...defaultTheme.fontFamily.sans],
    },
  },
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },
  future: {
    removeDeprecatedGapUtilities: true,
    defaultLineHeights: true,
    standardFontWeights: true,
    purgeLayersByDefault: true,
  },
};

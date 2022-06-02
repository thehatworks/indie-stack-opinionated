module.exports = (cfg) => {
  const _ = require("lodash");

  const dev = cfg.env === "development";
  const scss = cfg.file.extname === ".scss";

  /* This escape is self documenting, leaving it in */
  /* eslint-disable no-useless-escape */
  const match_regular_rules = /[\w-\[\]/:]+(?<!:)/g;
  /* eslint-enable no-useless-escape */

  const match_jit_rules = /(.*-\[.+\].*)/g;

  return {
    map: dev ? true : false,
    parser: scss ? "postcss-scss" : false,
    plugins: [
      require("@csstools/postcss-sass")(),
      require("tailwindcss/nesting")("postcss-nesting"),
      require("tailwindcss")("./config/tailwind.config.js"),
      require("autoprefixer")(),
      require("postcss-flexbugs-fixes")(),
      require("postcss-sort-media-queries")(),
      require("@fullhuman/postcss-purgecss")({
        content: ["./styles/**/*", "./app/**/*.tsx"],
        defaultExtractor: (content) =>
          _.concat(
            content.match(match_jit_rules) || [],
            content.match(match_regular_rules) || []
          ),
      }),
      dev ? null : require("cssnano")(),
    ],
  };
};

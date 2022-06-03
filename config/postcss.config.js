// really don't like dynamicAttributes..
// there a better solution?

// debug this more here https://regexr.com/6n062

// const match_attribute_rules = /([^\r\n,{};]+\[[^\r\n{};]+\])/g;

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
      // => ~4k lines
      require("tailwindcss")("./config/tailwind.config.ts"),
      // => ~44k lines
      require("autoprefixer")(),
      // => ~50k lines
      require("postcss-flexbugs-fixes")(),
      // => ~50k lines
      require("postcss-sort-media-queries")(),
      // => ~50k lines
      require("@fullhuman/postcss-purgecss")({
        content: ["./styles/**/*", "./app/**/*.tsx"],
        css: ["./styles/**/*"],
        variables: true,
        keyframes: true,
        dynamicAttributes: ["role", "type", "name", "title", "href", "lang"],
        defaultExtractor: (content) =>
          _.concat(
            content.match(match_jit_rules) || [],
            content.match(match_regular_rules) || []
          ),
      }),
      // => ~7.5k lines
      dev ? null : require("cssnano")(),
      // without purgecss =>
      //   1.3 MB minified size
      // with purgecss =>
      //   192K minified size
    ],
  };
};

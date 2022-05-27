module.exports = (cfg) => {
  const dev = cfg.env === "development";
  const scss = cfg.file.extname === ".scss";

  return {
    map: dev ? true : false,
    parser: scss ? "postcss-scss" : false,
    plugins: [
      require("tailwindcss")("./config/tailwind.config.js"),
      require('@csstools/postcss-sass')(),
      require("autoprefixer")(),
      require("postcss-flexbugs-fixes")(),
      require("postcss-sort-media-queries")(),
      dev ? null : require("cssnano")(),
    ],
  };
};

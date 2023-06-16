module.exports = (cfg) => {
  const dev = cfg.env === "development";
  const scss = cfg.file.extname === ".scss";

  return {
    map: dev ? true : false,
    parser: scss ? "postcss-scss" : false,
    plugins: [
      require("tailwindcss")("./config/tailwind.config.ts"),
      require("postcss-flexbugs-fixes")(),
      require("postcss-for")(),
      require("postcss-advanced-variables")(),
      require("postcss-nested")(),
      require("postcss-sort-media-queries")(),
      require("autoprefixer")(),
      dev ? null : require("cssnano")(),
    ],
  };
};

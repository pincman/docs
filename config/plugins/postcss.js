module.exports = function (context, options) {
  return {
    name: "postcss-tailwindcss-loader",
    configurePostCss(postcssOptions) {
      // Appends new PostCSS plugin.
      postcssOptions.plugins = [
        require("postcss-import"),
        require("tailwindcss/nesting"),
        require("tailwindcss"),
        require("autoprefixer"),
      ];
      return postcssOptions;
    },
  };
};

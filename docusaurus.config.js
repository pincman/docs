// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "pincman文档",
  tagline: "全栈开发文档集",
  url: "https://docs.pincman.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "pincman", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans", "en"],
  },
  plugins: require("./config/plugins"),
  presets: require("./config/presets"),
  themeConfig: require("./config/theme"),
};

module.exports = config;

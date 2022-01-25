const path = require("path");
/** @type {import('@docusaurus/types').PresetConfig[]} */
module.exports = [
  [
    "classic",
    /** @type {import('@docusaurus/preset-classic').Options} */
    ({
      docs: {
        sidebarPath: require.resolve(path.resolve(__dirname, "../sidebars.js")),
        // Please change this to your repo.
        editUrl:
          "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
      },
      blog: {
        showReadingTime: true,
        // Please change this to your repo.
        editUrl:
          "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
      },
      theme: {
        customCss: require.resolve(
          path.resolve(__dirname, "../src/styles/index.css")
        ),
      },
    }),
  ],
];

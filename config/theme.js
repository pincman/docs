/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
module.exports = {
  hideableSidebar: true,
  liveCodeBlock: {
    playgroundPosition: "bottom",
  },
  navbar: {
    title: "Pincman的全栈笔记",
    logo: {
      alt: "My Site Logo",
      src: "img/logo.svg",
    },
    items: [
      {
        type: "doc",
        docId: "react/intro",
        position: "left",
        label: "React文档",
      },
      { to: "/blog", label: "Blog", position: "left" },
      {
        href: "https://github.com/facebook/docusaurus",
        label: "GitHub",
        position: "right",
      },
    ],
  },
  footer: {
    style: "dark",
    links: [
      {
        title: "Docs",
        items: [
          {
            label: "Tutorial",
            to: "/docs/intro",
          },
        ],
      },
      {
        title: "Community",
        items: [
          {
            label: "Stack Overflow",
            href: "https://stackoverflow.com/questions/tagged/docusaurus",
          },
          {
            label: "Discord",
            href: "https://discordapp.com/invite/docusaurus",
          },
          {
            label: "Twitter",
            href: "https://twitter.com/docusaurus",
          },
        ],
      },
      {
        title: "More",
        items: [
          {
            label: "Blog",
            to: "/blog",
          },
          {
            label: "GitHub",
            href: "https://github.com/facebook/docusaurus",
          },
        ],
      },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
  },
  prism: {
    theme: lightCodeTheme,
    darkTheme: darkCodeTheme,
  },
};

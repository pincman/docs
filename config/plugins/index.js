const path = require("path");
module.exports = [
  "docusaurus-plugin-less",
  require(path.resolve(__dirname, "./webpack.js")),
  require(path.resolve(__dirname, "./postcss.js")),
];

const ArcoWebpackPlugin = require("@arco-design/webpack-plugin");
module.exports = function (context, options) {
  return {
    name: "custom-webpack-plugin",
    configureWebpack(config, isServer, utils) {
      return {
        plugins: [new ArcoWebpackPlugin()],
      };
    },
  };
};

require('dotenv').config();
const withPWA = require("next-pwa");
const withAntdLess = require('next-plugin-antd-less');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  env: {
    spaceID: process.env.spaceID,
    accessTokenDelivery: process.env.accessTokenDelivery,
  },
  distDir: '.next',
};

const plugins = [
  withPWA({
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
    },
  }),
  withAntdLess({
    // optional
    modifyVars: {
      '@primary-color': '#4F708A',
      '@font-family': "IBM Plex Sans Thai, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans- serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    },
    // optional
    lessVarsFilePathAppendToEndOfContent: false,
    // optional https://github.com/webpack-contrib/css-loader#object
    cssLoaderOptions: {},

    // Other Config Here...
    webpack(config) {
      return config;
    },
  })
]

module.exports = withPlugins(plugins, nextConfig);
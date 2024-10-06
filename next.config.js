require('dotenv').config();
const withAntdLess = require('next-plugin-antd-less');
const withPlugins = require('next-compose-plugins');

const nextConfig = {
  env: {
    spaceID: process.env.spaceID,
    accessTokenDelivery: process.env.accessTokenDelivery,
  },
  distDir: '.next',
  images: {
    domains: ['res.cloudinary.com'],
  },
};

const plugins = [
  withAntdLess({
    // optional
    modifyVars: {
      '@primary-color': '#80644f',
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
// next.config.js

const withAntdLess = require('next-plugin-antd-less');

const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  images: {
    domains: ['res.cloudinary.com'],
  },
  env: {
    spaceID: process.env.spaceID,
    accessTokenDelivery: process.env.accessTokenDelivery,
  },
  webpack(config) {
    // Add any custom webpack configurations here
    return config;
  },
};

module.exports = withAntdLess({
  ...nextConfig,
  modifyVars: {
    '@primary-color': '#80644f',
    '@font-family':
      "IBM Plex Sans Thai, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  },
  lessVarsFilePathAppendToEndOfContent: false,
  cssLoaderOptions: {},
  webpack(config) {
    // If you have additional webpack customizations, add them here
    return config;
  },
});

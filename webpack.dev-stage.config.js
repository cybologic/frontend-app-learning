// const path = require('path');
// const { createConfig } = require('@openedx/frontend-build');

// const config = createConfig('webpack-dev');

// config.resolve.alias = {
//   ...config.resolve.alias,
//   '@src': path.resolve(__dirname, 'src'),
// };

// module.exports = config;

const { createConfig } = require('@openedx/frontend-build');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Injects stage-specific env vars from .env.private.
 *
 * Note: ideally, we could use the base config for `webpack-dev-stage` in
 * `getBaseConfig` above, however it appears to have a bug so we have to
 * manually load the stage-specific env vars ourselves for now.
 *
 * The .env.private env vars must be loaded before the base
 * config is created.
 */
dotenv.config({
  path: path.resolve(process.cwd(), '.env.private'),
});

const config = createConfig('webpack-dev', {
  devServer: {
    allowedHosts: 'all',
    server: 'https',
  },
});

config.module.rules[0].exclude = /node_modules\/(?!(lodash-es|@(open)?edx))/;

config.resolve.alias = {
  ...config.resolve.alias,
  '@src': path.resolve(__dirname, 'src'),
};


module.exports = config;
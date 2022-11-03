const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const path = require('path')
const modulesDir = path.join(process.cwd(), 'node_modules')

const updateEmotionAliases = (config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@emotion/core': path.join(modulesDir, '@emotion/react'),
      '@emotion/styled': path.join(modulesDir, '@emotion/styled'),
      '@emotion/styled-base': path.join(modulesDir, '@emotion/styled'),
      'emotion-theming': path.join(modulesDir, '@emotion/react')
    }
  }
})

module.exports = {
  staticDirs: ['../public'],
  core: {
    builder: 'webpack5'
  },
  features: {
    // storyStoreV7: true
  },
  framework: '@storybook/react',
  stories: [
    '../src/stories/**/*.story.@(tsx)',
    '../src/**/*.stories.@(tsx)'
  ],
  addons: [
    '@storybook/addon-knobs',
    'storybook-addon-next-router',
    {
      name: '@storybook/addon-essentials'
    }
  ],
  webpackFinal: async (config, { configType }) => {
    // config.resolve.fallback.fs = false

    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: ['style-loader', 'css-loader', 'sass-loader'],
    //   include: path.resolve(__dirname, '../')
    // })
    config.resolve.plugins = config.resolve.plugins || []
    config.resolve.plugins.push(new TsconfigPathsPlugin())

    // Return the altered config

    return updateEmotionAliases(config)
  },
  managerWebpack: updateEmotionAliases,
  typescript: {
    //   check: true,
    //   checkOptions: {},
    reactDocgen: false
    //   reactDocgenTypescriptOptions: {
    //     shouldExtractLiteralValuesFromEnum: true,
    //     propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    //   }
  }
}

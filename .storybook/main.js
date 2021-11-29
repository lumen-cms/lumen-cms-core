const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  staticDirs: ['../public'],
  core: {
    builder: 'webpack5'
  },
  features: {
    // storyStoreV7: true
  },
  framework: '@storybook/react',
  stories: ['../src/stories/**/*.stories.@(tsx)'],
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
    return config
  },
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

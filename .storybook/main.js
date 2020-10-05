const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../stories/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-knobs',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        actions: false,
        controls: false
      }
    }
  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: ['style-loader', 'css-loader', 'sass-loader'],
    //   include: path.resolve(__dirname, '../')
    // })
    config.resolve.plugins = [new TsconfigPathsPlugin()]
    // Return the altered config
    return config
  }
  // typescript: {
  //   check: true,
  //   checkOptions: {},
  //   reactDocgen: 'react-docgen-typescript',
  //   reactDocgenTypescriptOptions: {
  //     shouldExtractLiteralValuesFromEnum: true,
  //     propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
  //   }
  // }
}

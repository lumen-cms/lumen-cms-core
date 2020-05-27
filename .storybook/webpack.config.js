const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = ({config}) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: {
          transpileOnly: true
        }
      },
      {
        loader: require.resolve('react-docgen-typescript-loader')
      }
    ]
  })
  config.resolve.extensions.push('.ts', '.tsx')

  config.resolve.plugins = config.resolve.plugins || []
  config.resolve.plugins.push(new TsconfigPathsPlugin())

  return config
}

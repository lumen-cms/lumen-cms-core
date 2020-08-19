module.exports = {
  stories: ['../stories/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-knobs'
  ],
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

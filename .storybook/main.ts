import type { StorybookConfig } from '@storybook/nextjs'
import path from 'node:path'

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: ['../src/stories/**/*.story.tsx', '../src/**/*.stories.tsx'],
  framework: { name: '@storybook/nextjs', options: {} },
  addons: ['@storybook/addon-docs'],
  typescript: { reactDocgen: false },
  webpackFinal: async (config) => {
    // Keep a slash-terminated publicPath: older webpack-dev-middleware versions
    // can escape the output directory when a path prefix has no trailing slash.
    config.output = { ...config.output, publicPath: '/' }
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/image$': path.resolve('.storybook/NextImage.tsx'),
      'next/legacy/image$': path.resolve('.storybook/NextLegacyImage.tsx')
    }
    return config
  }
}
export default config

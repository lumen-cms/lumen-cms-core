import type { StorybookConfig } from '@storybook/nextjs'
import path from 'node:path'

const config: StorybookConfig = {
  staticDirs: ['../public'],
  stories: ['../src/stories/**/*.story.tsx', '../src/**/*.stories.tsx'],
  framework: { name: '@storybook/nextjs', options: {} },
  addons: ['@storybook/addon-docs'],
  typescript: { reactDocgen: false },
  webpackFinal: async (config) => {
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

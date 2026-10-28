import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const aliases = {
  '@CONFIG': resolve('./src/utils/config.ts'),
  '@SSR_CONFIG': resolve('./src/utils/initial-props/ssrConfig.ts'),
  '@LmComponentRender': resolve('./src/components/CoreComponents.tsx'),
  '@context': resolve('./src/components/provider/context')
}

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias: aliases },
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.integration.test.{ts,tsx}'],
          setupFiles: ['./test/setup.ts'],
          restoreMocks: true,
          unstubGlobals: true,
          unstubEnvs: true
        }
      },
      {
        resolve: { alias: aliases },
        test: {
          name: 'integration',
          environment: 'node',
          include: ['src/**/*.integration.test.{ts,tsx}'],
          setupFiles: ['./test/integration-setup.ts'],
          testTimeout: 30000,
          fileParallelism: false
        }
      }
    ]
  }
})

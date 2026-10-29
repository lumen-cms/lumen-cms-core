import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
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

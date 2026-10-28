import { defineConfig, globalIgnores } from 'eslint/config'
import next from 'eslint-config-next'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
  ...next,
  prettier,
  globalIgnores([
    '**/generated/*.tsx',
    '**/generated/*.ts',
    'src/typings/storyblok.d.ts',
    'stories/**/*.*',
    'src/storybook/**/*.*',
    '__generated__/**/*.*',
    '**/*.graphql.d.ts',
    '**/*.js',
    'jest*'
  ]),
  {
    languageOptions: { globals: { gtag: 'readonly', fbq: 'readonly' } },
    settings: { 'import/resolver': { typescript: {} } },
    rules: {
      // Newly introduced compiler diagnostics remain visible during staged adoption.
      // This library does not enable React Compiler; preserve the existing lint gate.
      // See docs/security-tooling-update.md for the tracked rendering follow-up.
      'react-hooks/static-components': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
      radix: 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'react/prop-types': 0,
      'react/destructuring-assignment': 0,
      'react/static-property-placement': 0,
      'jsx-a11y/alt-text': 0,
      'react/jsx-props-no-spreading': 0,
      semi: 'off',
      'comma-dangle': 'off',
      camelcase: 'off',
      'no-console': 'off',
      'no-alert': 'off',
      'import/prefer-default-export': 0,
      'import/no-extraneous-dependencies': 0,
      'no-plusplus': 'off',
      'no-nested-ternary': 'off',
      'no-shadow': 'off',
      'no-param-reassign': 'off',
      'no-unused-expressions': 'off',
      'react/no-array-index-key': 1,
      'jsx-a11y/anchor-is-valid': 1,
      'react/require-default-props': 0,
      'react/react-in-jsx-scope': 0,
      'react/no-danger': 0,
      '@next/next/no-html-link-for-pages': 'off'
    }
  }
])

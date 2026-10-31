const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { test } = require('node:test')
const { registrySource } = require('../scripts/generate-storyblok-registry.cjs')

test('discovers discriminators, ignores helpers and root-only unions, and sorts deterministically', () => {
  const first = 'export interface Zebra { component: "z-block"; title: string }'
  const second = 'export interface Alpha { "component": "a block" }'
  const helpers =
    'export interface Helper { value: string }; export type ContentType = Zebra;'
  const result = registrySource(first + second + helpers)
  assert.equal(result, registrySource(second + helpers + first))
  assert.match(result, /"a block": Components.Alpha/)
  assert.match(result, /"z-block": Components.Zebra/)
  assert.doesNotMatch(result, /Components.Helper|Components.ContentType/)
})

test('rejects ambiguous or missing discriminators', () => {
  for (const source of [
    'export interface A { component: string }',
    'export interface A { component?: "a" }',
    'export interface A { component: "a" | "b" }',
    'export interface A { component: "a" }; export interface B { component: "a" }',
    'export interface Helper { value: string }'
  ])
    assert.throws(() => registrySource(source))
})

test('official CLI additions, field changes and removals flow into checked registry types', () => {
  const root = path.resolve(__dirname, '..')
  const cache = path.join(root, '.storyblok')
  fs.mkdirSync(cache, { recursive: true })
  const directory = fs.mkdtempSync(path.join(cache, 'registry-test-'))
  const run = (command, args) => {
    const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' })
    assert.equal(
      result.status,
      0,
      result.error?.message || result.stdout + result.stderr
    )
  }
  const schemaDir = path.join(directory, 'components/123')
  const typesDir = path.join(directory, 'types/123')
  const generate = (components) => {
    fs.writeFileSync(
      path.join(schemaDir, 'components.json'),
      JSON.stringify(components)
    )
    run(path.join(root, 'node_modules/.bin/storyblok'), [
      '--path',
      directory,
      '--no-log-file-enabled',
      '--no-report-enabled',
      'types',
      'generate',
      '--space',
      '123',
      '--filename',
      'components',
      '--type-suffix',
      'Storyblok',
      '--custom-fields-parser',
      path.join(root, 'generate-ts-schema-custom-types.js')
    ])
    const input = path.join(typesDir, 'components.d.ts')
    const before = fs.readFileSync(input, 'utf8')
    run(process.execPath, [
      path.join(root, 'scripts/generate-storyblok-registry.cjs'),
      input
    ])
    assert.equal(fs.readFileSync(input, 'utf8'), before)
  }
  const check = (source) => {
    fs.writeFileSync(path.join(directory, 'consumer.ts'), source)
    fs.writeFileSync(
      path.join(directory, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
          module: 'NodeNext'
        },
        files: ['consumer.ts']
      })
    )
    run(process.execPath, [
      path.join(root, 'scripts/check-types.cjs'),
      '-p',
      path.join(directory, 'tsconfig.json')
    ])
  }
  try {
    fs.mkdirSync(schemaDir, { recursive: true })
    const page = { name: 'page', is_root: true, schema: {} }
    const promo = {
      name: 'new_promo',
      is_root: false,
      schema: { title: { type: 'text', required: true } }
    }
    generate([page, promo])
    check(`import type { GeneratedStoryblokComponentMap as Map } from './types/123/registry';
      const title: Map['new_promo']['title'] = 'Hello';
      // @ts-expect-error Required text field cannot be a number.
      const wrong: Map['new_promo']['title'] = 42;
      // @ts-expect-error Unknown components are not accepted.
      type Unknown = Map['missing'];`)
    generate([
      page,
      {
        ...promo,
        name: 'renamed_promo',
        schema: { enabled: { type: 'boolean', required: true } }
      }
    ])
    check(`import type { GeneratedStoryblokComponentMap as Map } from './types/123/registry';
      const enabled: Map['renamed_promo']['enabled'] = true;
      // @ts-expect-error Old component name disappears on regeneration.
      type Removed = Map['new_promo'];
      // @ts-expect-error Removed field falls back to the CLI's unknown index signature.
      const oldTitle: string = ({} as Map['renamed_promo'])['title'];
      // @ts-expect-error Boolean field retains its exact type.
      const wrong: Map['renamed_promo']['enabled'] = 'yes';`)
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

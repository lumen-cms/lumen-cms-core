// Exercise the configured codegen plugins offline, without replacing CMS types.
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { execFileSync } = require('node:child_process')

async function main() {
  const { generate } = await import('@graphql-codegen/cli')
  const root = path.resolve(__dirname, '..')
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lumen-codegen-'))
  try {
    await fs.symlink(
      path.join(root, 'node_modules'),
      path.join(directory, 'node_modules'),
      'dir'
    )
    const schema = path.join(directory, 'schema.graphql')
    const documents = path.join(directory, 'query.graphql')
    await fs.writeFile(
      schema,
      'interface Node { id: ID! }\ntype Story implements Node { id: ID!, title: String! }\ntype Query { story(id: ID!): Story, nodes: [Node!]! }\n'
    )
    await fs.writeFile(
      documents,
      'query Story($id: ID!) { story(id: $id) { id title } nodes { id ... on Story { title } } }\n'
    )
    const output = (name) => path.join(directory, name)
    await generate(
      {
        schema,
        documents,
        generates: {
          [output('types.ts')]: { plugins: ['typescript'] },
          [output('sdk.ts')]: {
            plugins: [
              'typescript',
              'typescript-operations',
              'typescript-graphql-request'
            ]
          },
          [output('documents.ts')]: { plugins: ['typescript-document-nodes'] },
          [output('modules.d.ts')]: {
            plugins: ['typescript-graphql-files-modules']
          },
          [output('fragments.ts')]: { plugins: ['fragment-matcher'] },
          [output('operations.ts')]: {
            preset: 'import-types',
            presetConfig: { typesPath: './types' },
            plugins: ['typescript-operations']
          }
        }
      },
      true
    )
    await fs.writeFile(
      output('tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          skipLibCheck: true,
          noEmit: true,
          types: []
        },
        include: ['./*.ts']
      })
    )
    execFileSync(
      process.execPath,
      [
        path.join(root, 'node_modules/@typescript/native/bin/tsc'),
        '--project',
        output('tsconfig.json')
      ],
      { stdio: 'inherit' }
    )
    console.log(
      'All eight codegen packages exercised; generated output passes TypeScript 7.'
    )
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

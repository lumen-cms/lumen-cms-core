// Index the official CLI declarations without modifying them or interpreting CMS fields.
const fs = require('node:fs')
const path = require('node:path')
const { parse } = require('@babel/parser')

function registrySource(source) {
  const ast = parse(source, { sourceType: 'module', plugins: ['typescript'] })
  const components = new Map()
  for (const statement of ast.program.body) {
    if (statement.type !== 'ExportNamedDeclaration') continue
    const declaration = statement.declaration
    if (declaration?.type !== 'TSInterfaceDeclaration') continue
    const discriminator = declaration.body.body.find(
      (member) =>
        member.type === 'TSPropertySignature' &&
        (member.key.type === 'Identifier'
          ? member.key.name
          : member.key.value) === 'component'
    )
    if (!discriminator) continue
    const type = discriminator.typeAnnotation?.typeAnnotation
    if (
      discriminator.optional ||
      type?.type !== 'TSLiteralType' ||
      type.literal.type !== 'StringLiteral'
    ) {
      throw new Error(
        `${declaration.id.name} must have a required string-literal component discriminator`
      )
    }
    const name = type.literal.value
    if (components.has(name))
      throw new Error(`Duplicate Storyblok component discriminator: ${name}`)
    components.set(name, declaration.id.name)
  }
  if (!components.size)
    throw new Error('No Storyblok component interfaces found in CLI output')
  const entries = [...components].sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0
  )
  return [
    '// Generated from official Storyblok CLI declarations. Do not edit by hand.',
    'import type * as Components from "./components";',
    '',
    'export interface GeneratedStoryblokComponentMap {',
    ...entries.map(
      ([name, type]) => `  ${JSON.stringify(name)}: Components.${type};`
    ),
    '}',
    '',
    'export type GeneratedStoryblokContent =',
    '  GeneratedStoryblokComponentMap[keyof GeneratedStoryblokComponentMap];',
    ''
  ].join('\n')
}

if (require.main === module) {
  const directory = path.resolve(
    __dirname,
    '../src/typings/storyblok/types/82895'
  )
  const input = process.argv[2] || path.join(directory, 'components.d.ts')
  const output =
    process.argv[3] || path.join(path.dirname(input), 'registry.ts')
  // Parse and validate completely before replacing the previous index.
  const generated = registrySource(fs.readFileSync(input, 'utf8'))
  fs.writeFileSync(output, generated)
  console.log(`Indexed Storyblok component types: ${output}`)
}

module.exports = { registrySource }

// CLI 4 adapter for the repository's legacy schema snapshots. Only `pull` and
// `push` contact a Storyblok space. `candidate`, `generate`, and `check` are local.
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { spawnSync } = require('node:child_process')
const root = path.resolve(__dirname, '..')
const action = process.argv[2]
const space =
  process.argv[3] || process.env.STORYBLOK_SCHEMA_SPACE_ID || '82895'
if (!/^\d+$/.test(space)) throw new Error('Space ID must be numeric')
const cli = path.join(root, 'node_modules/storyblok/dist/index.mjs')
const legacyFile = path.join(root, `components.${space}.json`)
const snapshot = () => {
  const value = JSON.parse(fs.readFileSync(legacyFile, 'utf8'))
  const components = Array.isArray(value) ? value : value.components
  if (!Array.isArray(components)) throw new Error('Invalid components snapshot')
  return components
}
const run = (args) => {
  const result = spawnSync(
    process.execPath,
    [cli, '--no-log-file-enabled', '--no-report-enabled', ...args],
    { cwd: root, stdio: 'inherit' }
  )
  if (result.error) throw result.error
  if (result.status !== 0)
    throw new Error(`Storyblok CLI failed (${result.status})`)
}
if (['candidate', 'generate', 'check'].includes(action)) {
  const temporary = fs.mkdtempSync(
    path.join(os.tmpdir(), 'lumen-storyblok-types-')
  )
  try {
    const components = snapshot()
    for (const component of components)
      for (const field of Object.values(component.schema || {})) {
        // Old exports stored a single filter as a string; CLI 4 requires an array.
        if (typeof field.filter_content_type === 'string')
          field.filter_content_type = [field.filter_content_type]
      }
    const directory = path.join(temporary, 'components', space)
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(
      path.join(directory, 'components.json'),
      JSON.stringify(components)
    )
    run([
      '--path',
      temporary,
      'types',
      'generate',
      '--space',
      space,
      '--type-suffix',
      'Storyblok',
      '--custom-fields-parser',
      './generate-ts-schema-custom-types.js'
    ])
    const generated = path.join(
      temporary,
      'types',
      space,
      'storyblok-components.d.ts'
    )
    if (!fs.existsSync(generated))
      throw new Error('CLI produced no types; candidate was not updated')
    const output = path.join(root, '.storyblok/types-candidate')
    fs.mkdirSync(output, { recursive: true })
    fs.cpSync(path.join(temporary, 'types'), output, { recursive: true })
    // CLI 4 describes number fields as strings. Our public component API also
    // accepts numbers (including Storybook fixtures). Preserve both without
    // weakening other fields or changing the CMS snapshot.
    const ts = require('typescript')
    let source = fs.readFileSync(generated, 'utf8')
    const parsed = ts.createSourceFile(
      'components.ts',
      source,
      ts.ScriptTarget.Latest,
      true
    )
    const edits = []
    for (const node of parsed.statements) {
      if (!ts.isInterfaceDeclaration(node)) continue
      const discriminator = node.members.find(
        (member) => member.name?.getText(parsed) === 'component'
      )
      const component = components.find(
        (item) => item.name === discriminator?.type?.literal?.text
      )
      for (const member of node.members) {
        if (
          component?.schema[member.name?.getText(parsed)]?.type === 'number'
        ) {
          if (member.type?.kind !== ts.SyntaxKind.StringKeyword)
            throw new Error('Unexpected CLI number field type')
          edits.push([
            member.type.getStart(parsed),
            member.type.end,
            'number | string'
          ])
        }
      }
    }
    for (const [start, end, replacement] of edits.reverse())
      source = source.slice(0, start) + replacement + source.slice(end)
    source +=
      "\n// Application metadata and supported legacy fields live outside generated code.\nimport type {} from '../storyblok-extensions'\n"
    const files = [
      ['src/typings/generated/components-schema.ts', source],
      [
        'src/typings/storyblok.d.ts',
        fs.readFileSync(path.join(temporary, 'types/storyblok.d.ts'), 'utf8')
      ]
    ]
    if (action === 'generate') {
      for (const [file, content] of files)
        fs.writeFileSync(path.join(root, file), content)
      console.log(
        `Updated ${components.length} component types using the official CLI`
      )
    } else if (action === 'check') {
      for (const [file, content] of files) {
        if (fs.readFileSync(path.join(root, file), 'utf8') !== content)
          throw new Error(`Generated types are stale: ${file}`)
      }
      console.log('Checked-in Storyblok types match local schema generation')
    } else
      console.log(
        `Review raw CLI candidate: ${output}/${space}/storyblok-components.d.ts`
      )
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true })
  }
} else if (action === 'pull') {
  const temporary = fs.mkdtempSync(
    path.join(os.tmpdir(), 'lumen-storyblok-pull-')
  )
  try {
    run(['--path', temporary, 'components', 'pull', '--space', space])
    const exported = path.join(temporary, 'components', space)
    const components = JSON.parse(
      fs.readFileSync(path.join(exported, 'components.json'), 'utf8')
    )
    if (!Array.isArray(components))
      throw new Error('Unexpected CLI component export')
    const target = path.join(root, '.storyblok/components', space)
    fs.mkdirSync(target, { recursive: true })
    fs.cpSync(exported, target, { recursive: true })
    fs.writeFileSync(legacyFile, JSON.stringify({ components }, null, 2) + '\n')
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true })
  }
} else if (action === 'push') {
  const directory = path.join(root, '.storyblok/components', space)
  if (!fs.existsSync(path.join(directory, 'groups.json'))) {
    throw new Error(
      'Run fetch-storyblok-components first: CLI 4 needs the exported group/preset metadata before pushing.'
    )
  }
  fs.writeFileSync(
    path.join(directory, 'components.json'),
    JSON.stringify(snapshot(), null, 2) + '\n'
  )
  run(['components', 'push', '--space', space, '--from', space])
} else {
  throw new Error(
    'Usage: node scripts/storyblok-schema.cjs <candidate|generate|check|pull|push> [space-id]'
  )
}

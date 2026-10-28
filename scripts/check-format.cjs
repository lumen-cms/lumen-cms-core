// Keep the existing Prettier 2 policy independent of the ESLint plugin API.
// Ask ESLint for the file list so generated files have the same exclusions.
const { ESLint } = require('eslint')
const prettier = require('prettier')
const fs = require('node:fs/promises')

async function main() {
  const eslint = new ESLint()
  const results = await eslint.lintFiles(['src/**/*.{ts,tsx}'])
  const write = process.argv.includes('--write')
  let changed = 0
  for (const { filePath } of results) {
    const source = await fs.readFile(filePath, 'utf8')
    const options = {
      ...(await prettier.resolveConfig(filePath)),
      filepath: filePath
    }
    if (prettier.check(source, options)) continue
    changed++
    if (write) await fs.writeFile(filePath, prettier.format(source, options))
    else console.error(filePath)
  }
  console.log(
    `${results.length} files checked; ${changed} ${
      write ? 'formatted' : 'need formatting'
    }.`
  )
  if (changed && !write) process.exitCode = 1
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

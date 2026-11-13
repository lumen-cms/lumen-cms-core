const fs = require('node:fs')
const path = require('node:path')
const { builtinModules, createRequire } = require('node:module')
const root = path.resolve(__dirname, '..')
const ts = createRequire(path.join(root, 'packages/lumen-cms-astro/package.json'))('typescript')
const errors = []
function files(directory) {
 return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
}
function imports(source) {
 const result = []
 const ast = ts.createSourceFile('module.ts', source, ts.ScriptTarget.Latest, true)
 function visit(node) {
  if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) result.push(node.moduleSpecifier.text)
  if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isStringLiteral(node.arguments[0])) result.push(node.arguments[0].text)
  if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) result.push(node.argument.literal.text)
  ts.forEachChild(node, visit)
 }
 visit(ast)
 return result
}
for (const name of ['lumen-cms-shared', 'lumen-cms-astro']) {
 const directory = path.join(root, 'packages', name)
 const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'))
 const declared = { ...manifest.dependencies, ...manifest.peerDependencies, ...manifest.devDependencies }
 const sourceFiles = ['src', ...(name === 'lumen-cms-astro' ? ['src-server', 'build'] : [])].flatMap(dir => files(path.join(directory, dir)))
 if (name === 'lumen-cms-astro') sourceFiles.push(path.join(directory, 'config.mjs'), path.join(directory, 'integration.mjs'))
 for (const file of sourceFiles) {
  if (!/\.(ts|js|mjs|astro)$/.test(file) || file.includes('/src/pages/')) continue
  const text = fs.readFileSync(file, 'utf8')
  if (/NEXT_PUBLIC_[A-Z_]+/.test(text)) errors.push(`${file}: legacy Next environment variable in Astro package`)
  const sources = file.endsWith('.astro') ? [text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '', ...[...text.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1])] : [text]
  for (const spec of sources.flatMap(imports)) {
   if (spec.startsWith('.')) {
    const target = path.resolve(path.dirname(file), spec)
    if (!target.startsWith(directory + path.sep)) errors.push(`${file}: import escapes package: ${spec}`)
    if (![target, ...['.ts', '.tsx', '.js', '.mjs', '.json', '.d.ts', '/index.ts', '/index.js'].map(ext => target + ext)].some(p => fs.existsSync(p) && fs.statSync(p).isFile())) errors.push(`${file}: missing relative module: ${spec}`)
   } else {
    if (spec.startsWith('node:') || spec.startsWith('astro:') || spec === 'virtual:lumen-mdi-icons' || builtinModules.includes(spec)) continue
    const dependency = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]
    if (dependency !== name && !declared[dependency]) errors.push(`${file}: undeclared dependency: ${dependency}`)
    if (/^(react|react-dom|next|@mui\/|@emotion\/|@auth0\/)/.test(dependency) && !(dependency === '@auth0/auth0-server-js' && file.includes('/src/server/'))) errors.push(`${file}: legacy UI dependency: ${dependency}`)
   }
  }
 }
}
if (errors.length) throw new Error(errors.join('\n'))
console.log('Astro/shared package boundaries and dependency declarations pass.')

import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'

/** Audit emitted chunks, including bundled dependencies and external imports.
 * Reports are opt-in and written outside the public build directory. */
export function runtimeAudit() {
 return {
  name: 'lumen-runtime-audit',
  apply: 'build',
  async generateBundle(output, bundle) {
   const chunks = Object.values(bundle).filter(item => item.type === 'chunk')
   const modules = [...new Set(chunks.flatMap(chunk => Object.keys(chunk.modules)))].sort()
   const imports = [...new Set(chunks.flatMap(chunk => [...chunk.imports, ...chunk.dynamicImports]))].sort()
   const forbidden = [...modules, ...imports].filter(id => /(?:^|[/\\]node_modules[/\\])(?:react|react-dom|next|@mui|@emotion)(?:[/\\]|$)/.test(id))
   if (forbidden.length) this.error(`Legacy UI runtime in Astro output:\n${[...new Set(forbidden)].join('\n')}`)
   if (process.env.LUMEN_RUNTIME_AUDIT_DIR) {
    const directory = resolve(process.env.LUMEN_RUNTIME_AUDIT_DIR)
    const environment = this.environment?.name || 'build'
    const suffix = createHash('sha256').update(output.dir || output.file || environment).digest('hex').slice(0, 8)
    await mkdir(directory, { recursive: true })
    await writeFile(join(directory, `${process.env.LUMEN_SITE || 'fixture'}-${environment}-${suffix}.json`), JSON.stringify({ environment, output: output.dir || output.file, chunks: chunks.map(chunk => chunk.fileName), chunkDetails: chunks.map(chunk => ({ file: chunk.fileName, bytes: Buffer.byteLength(chunk.code), gzipBytes: gzipSync(chunk.code).length, modules: Object.keys(chunk.modules), imports: chunk.imports, dynamicImports: chunk.dynamicImports })), modules, imports, forbidden }, null, 2) + '\n')
   }
  },
 }
}

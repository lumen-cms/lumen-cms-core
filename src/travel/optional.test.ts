import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { expect, it, vi } from 'vitest'
import ts from 'typescript'

it('does not make travel reachable from the default core entry points', () => {
  const visited = new Set<string>()
  const visit = (file: string) => {
    if (visited.has(file)) return
    visited.add(file)
    expect(file).not.toContain('/src/travel/')
    const source = ts.createSourceFile(
      file,
      readFileSync(file, 'utf8'),
      ts.ScriptTarget.Latest,
      true
    )
    const walk = (node: ts.Node) => {
      const specifier =
        ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
          ? node.moduleSpecifier
          : ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword
          ? node.arguments[0]
          : undefined
      if (
        specifier &&
        ts.isStringLiteral(specifier) &&
        specifier.text.startsWith('.')
      ) {
        const target = resolve(dirname(file), specifier.text)
        const resolved = [
          target,
          ...['.ts', '.tsx', '.js', '/index.ts', '/index.tsx'].map(
            (suffix) => target + suffix
          )
        ].find(
          (candidate) =>
            /\.[cm]?[jt]sx?$/.test(candidate) && existsSync(candidate)
        )
        if (resolved) visit(resolved)
      }
      ts.forEachChild(node, walk)
    }
    walk(source)
  }
  for (const entry of [
    'src/index.ts',
    'src/server.ts',
    'src/pages/api/sitemap.ts'
  ])
    visit(resolve(entry))
  expect(visited.size).toBeGreaterThan(50)
})

it('requires travel configuration only when a travel request is made', async () => {
  vi.stubEnv('TRAVEL_GRAPHQL_ENDPOINT', '')
  vi.stubEnv('NEXT_PUBLIC_GQL_HOSTNAME', '')
  const { hasuraGraphqlSdk } = await import('./utils/graphql-request')
  expect(() => hasuraGraphqlSdk.travelBySlug({ slug: 'trip' })).toThrow(
    'required for travel requests'
  )
})

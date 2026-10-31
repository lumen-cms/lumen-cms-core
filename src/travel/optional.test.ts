import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { expect, it, vi } from 'vitest'
import { parse } from '@babel/parser'

it('does not make travel reachable from the default core entry points', () => {
  const visited = new Set<string>()
  const visit = (file: string) => {
    if (visited.has(file)) return
    visited.add(file)
    expect(file).not.toContain('/src/travel/')
    const source = parse(readFileSync(file, 'utf8'), {
      sourceType: 'unambiguous',
      plugins: ['typescript', 'jsx'],
      createImportExpressions: true
    })
    const walk = (value: unknown) => {
      if (!value || typeof value !== 'object') return
      const node = value as Record<string, unknown>
      const specifier =
        node.type === 'ImportDeclaration' ||
        node.type === 'ExportNamedDeclaration' ||
        node.type === 'ExportAllDeclaration' ||
        node.type === 'ImportExpression'
          ? (node.source as { type?: string; value?: string })
          : undefined
      if (
        specifier?.type === 'StringLiteral' &&
        specifier.value?.startsWith('.')
      ) {
        const target = resolve(dirname(file), specifier.value)
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
      for (const child of Object.values(node)) {
        if (Array.isArray(child)) child.forEach(walk)
        else walk(child)
      }
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

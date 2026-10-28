import {
  canonicalPageData as canonical,
  type PageDataJson as Json
} from './serverPageData.test-utils'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { afterAll, expect, it } from 'vitest'

const baseline = process.env.PAGE_DATA_BASELINE
const candidate = process.env.PAGE_DATA_CANDIDATE
const sites = ['baliinternships', 'planet-training', 'upskill']
const report: Record<string, unknown> = {}

const fingerprint = (value: Json) =>
  createHash('sha256')
    .update(JSON.stringify(canonical(value)))
    .digest('hex')
function load(root: string, site: string) {
  const directory = join(root, 'packages', site, '.next/server/pages')
  if (!existsSync(directory)) throw new Error(`Missing built pages for ${site}`)
  const pages = new Map<string, Json>()
  function walk(folder: string) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (
        entry.name.endsWith('.json') &&
        !entry.name.endsWith('.nft.json')
      ) {
        const data = JSON.parse(readFileSync(file, 'utf8'))
        if ('pageProps' in data)
          pages.set(relative(directory, file), data.pageProps)
      }
    }
  }
  walk(directory)
  if (!pages.size) throw new Error(`No page-data JSON found for ${site}`)
  return pages
}
function stats(value: Json) {
  const result = {
    components: 0,
    arrayItems: 0,
    stories: 0,
    listItems: 0,
    formFields: 0
  }
  function walk(item: Json, key = '') {
    if (Array.isArray(item)) {
      result.arrayItems += item.length
      if (key === 'stories' || key === 'items') result.listItems += item.length
      if (key === 'fields') result.formFields += item.length
      item.forEach((value) => walk(value))
    } else if (item && typeof item === 'object') {
      if (typeof item.component === 'string') result.components++
      if (typeof item.uuid === 'string' && item.content) result.stories++
      Object.entries(item).forEach(([key, value]) => walk(value, key))
    }
  }
  walk(value)
  return result
}
function differencePaths(a: Json, b: Json, path = '$'): string[] {
  if (JSON.stringify(a) === JSON.stringify(b)) return []
  if (
    !a ||
    !b ||
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    Array.isArray(a) !== Array.isArray(b)
  )
    return [path]
  const left = a as Record<string, Json>,
    right = b as Record<string, Json>
  return [...new Set([...Object.keys(left), ...Object.keys(right)])]
    .flatMap((key) => differencePaths(left[key], right[key], `${path}.${key}`))
    .slice(0, 15)
}
for (const site of sites)
  it.skipIf(!baseline || !candidate)(
    `${site}: all server page props match the pre-migration build`,
    () => {
      const before = load(baseline!, site),
        after = load(candidate!, site)
      const missing = [...before.keys()].filter((key) => !after.has(key))
      const added = [...after.keys()].filter((key) => !before.has(key))
      const differences: { route: string; paths: string[] }[] = []
      const beforeCounts = stats([...before.values()]),
        afterCounts = stats([...after.values()])
      for (const [route, props] of before) {
        const next = after.get(route)
        if (next !== undefined && fingerprint(props) !== fingerprint(next))
          differences.push({
            route,
            paths: differencePaths(canonical(props), canonical(next))
          })
      }
      report[site] = {
        routes: before.size,
        candidateRoutes: after.size,
        missing,
        added,
        beforeCounts,
        afterCounts,
        differences
      }
      expect({ missing, added, differences }).toEqual({
        missing: [],
        added: [],
        differences: []
      })
      expect(afterCounts).toEqual(beforeCounts)
    }
  )
afterAll(() => {
  if (process.env.PAGE_DATA_REPORT)
    writeFileSync(
      process.env.PAGE_DATA_REPORT,
      JSON.stringify(
        {
          comparedAt: new Date().toISOString(),
          baseline,
          candidate,
          ignored: [
            '*.list_widget_data.cv (numeric Date.now build timestamp)',
            '*.form_data.fbzx (nonempty numeric Google Forms hidden token)'
          ],
          sites: report
        },
        null,
        2
      ) + '\n'
    )
})

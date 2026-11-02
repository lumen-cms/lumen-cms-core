import { readFile, appendFile } from 'node:fs/promises'
import path from 'node:path'
import { cache } from 'react'
import type { AppPageProps } from '@core/typings/app'
import { setGoogleFontsCss } from '@core/utils/initial-props/googleFontsCache'
import getPageProps from '@core/utils/initial-props/getPageProps'

type Entry = {
  path: string
  slug: string
  locale: string
  file: string
  prebuild: boolean
}
export async function entries(): Promise<Entry[]> {
  return JSON.parse(
    await readFile(path.join(process.cwd(), 'content/manifest.json'), 'utf8')
  )
}
export async function readPage(pathname: string): Promise<AppPageProps | null> {
  const entry = (await entries()).find((item) => item.path === pathname)
  if (!entry) return null // Deliberately restricted public pilot surface.
  await appendFile(path.join(process.cwd(), 'generation.log'), pathname + '\n')
  if (process.env.PILOT_CONTENT_SOURCE === 'live') {
    // Only known public pilot URLs are accepted. This executes on generation,
    // never on a warm route-cache hit. Preview/private pages are not supported.
    return getPageProps(entry.slug, {
      locale: entry.locale,
      locales: ['en', 'de'],
      defaultLocale: 'en',
      insideStoryblok: false
    })
  }
  const fonts: Record<string, string> = JSON.parse(
    await readFile(path.join(process.cwd(), 'content/fonts.json'), 'utf8')
  )
  for (const [href, css] of Object.entries(fonts)) setGoogleFontsCss(href, css)
  return JSON.parse(
    await readFile(path.join(process.cwd(), 'content', entry.file), 'utf8')
  )
}
export const cachedPage = cache(readPage)
export const pathnameFrom = (parts: string[] = []) => '/' + parts.join('/')

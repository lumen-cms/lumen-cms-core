import { expect, it } from 'vitest'
import { CONFIG } from '../../packages/lumen-cms-shared/src/core/utils/config'
import { prepareForStoryblok } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/prepareStoryblokRequest'

it.each([
 ['de', 'de/course', ['de'], 'de', 'de/course'],
 ['website', 'de/website/course', ['en', 'de'], 'en', 'website/course'],
 ['website', 'website/course', ['en'], 'en', 'website/course'],
])('retains the CMS root %s exactly once when rendering %s', (root, slug, locales, defaultLocale, expected) => {
 const original = CONFIG.rootDirectory
 try {
  CONFIG.rootDirectory = root
  expect(prepareForStoryblok(slug.split('/'), { locales, defaultLocale, locale: locales.at(-1) }).pageSlug).toBe(expected)
 } finally { CONFIG.rootDirectory = original }
})

import { getAllStoriesOfProject } from 'lumen-cms-shared/core/utils/initial-props/storyblokPagesConfig'

// Server-only, one delivery request (including pagination) per language/build.
// Draft previews use Storyblok's resolved links instead of this published snapshot.
const inventories = new Map<string, ReturnType<typeof getAllStoriesOfProject>>()
export function clearPublishedLinkInventory() { inventories.clear() }
export function publishedLinkStories(language?: string) {
 const key = language || ''
 let pending = inventories.get(key)
 if (!pending) {
  pending = getAllStoriesOfProject({ version: 'published', ...(language ? { language } : {}), filter_query: { component: { in: 'page,news,event' } } })
  inventories.set(key, pending)
  pending.catch(() => inventories.delete(key))
 }
 return pending
}
export async function publishedLinkIndex(language?: string): Promise<Record<string, string>> {
 return Object.fromEntries((await publishedLinkStories(language)).map(story => [story.uuid, story.full_slug]))
}

/** Folder translations are already separate stories. Field translations require
 * one published inventory per configured language, including translated slugs. */
export async function publishedRouteStories(locales: readonly string[], fieldLevelTranslation: boolean) {
 if (!fieldLevelTranslation) return publishedLinkStories()
 return (await Promise.all(locales.map(async (locale, index) =>
  (await publishedLinkStories(index === 0 ? undefined : locale)).map(story => ({ ...story, locale }))
 ))).flat()
}

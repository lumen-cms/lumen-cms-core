import type { ListStoriesStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import type { ISbStoriesParams } from 'storyblok-js-client'
import { storyblokRelationIds } from 'lumen-cms-shared/core/utils/universal/storyblokRelations'

/** Defaults are resolved on the server; this builder has no process/global config. */
export function listStoriesParams(content: ListStoriesStoryblok, defaults: ISbStoriesParams, page = 1, searchText = '', searchCategories: string[] = []): ISbStoriesParams {
 const order = content.sort_descending ? 'desc' : 'asc'
 const sorts: Record<string, string> = {
  created: `created_at:${order}`, updated: `updated_at:${order}`,
  publish: `content.preview_publish_date:${order},published_at:desc`,
  title: `content.preview_title:${order},content.meta_title:${order},name:${order}`
 }
 const filter: Record<string, unknown> = { component: { in: content.view_types?.length ? content.view_types.join(',') : 'page,event,news' } }
 const or: Record<string, Record<string, string>>[] = []
 const categories = [...storyblokRelationIds(content.event_categories), ...storyblokRelationIds(content.news_categories)]
 if (categories.length) or.push({ category: { in: categories.join(',') } })
 const pageCategories = [...searchCategories, ...storyblokRelationIds(content.page_categories)]
 if (pageCategories.length) or.push({ categories: { [content.match_all_categories ? 'all_in_array' : 'in_array']: pageCategories.join(',') } })
 if (or.length) filter.__or = or
 return { ...defaults, per_page: Number(content.max_items || content.pagination?.[0]?.items_per_page || 25), filter_query: filter,
  sort_by: content.sort ? sorts[content.sort] || 'published_at:desc' : 'content.published_at:desc,content.preview_publish_date:desc,content.start:desc,content.title:asc', page,
  ...(searchText ? { search_term: searchText } : {}) }
}

/** MUI's default boundaryCount=1/siblingCount=1 pagination, expressed as data. */
export function paginationItems(page: number, count: number): (number | 'start-ellipsis' | 'end-ellipsis')[] {
 const range = (start: number, end: number) => Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i)
 const start = Math.max(Math.min(page - 1, count - 4), 3)
 const end = Math.min(Math.max(page + 1, 5), count - 2)
 return [
  ...range(1, Math.min(1, count)),
  ...(start > 3 ? ['start-ellipsis' as const] : 2 < count - 1 ? [2] : []),
  ...range(start, end),
  ...(end < count - 2 ? ['end-ellipsis' as const] : count - 1 > 1 ? [count - 1] : []),
  ...range(Math.max(count, 2), count)
 ]
}

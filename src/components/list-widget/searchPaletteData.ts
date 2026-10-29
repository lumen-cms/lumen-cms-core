import type { ISbStoriesParams, ISbStoryData } from 'storyblok-js-client'

export type SearchContent = {
  component: 'page'
  preview_title?: string
  title?: string
  meta_title?: string
}
export type SearchStory = ISbStoryData<SearchContent>

export async function fetchSearchStories([
  ,
  term,
  prefix,
  additionalLocales
]: readonly [string, string, string | undefined, string]): Promise<
  SearchStory[]
> {
  const params: ISbStoriesParams = {
    per_page: 25,
    sort_by: 'content.preview_title:desc',
    filter_query: { component: { in: 'page' } },
    excluding_fields: 'body,right_body,meta_robots,property,seo_body',
    search_term: term,
    excluding_slugs: [
      'demo-content*',
      `${prefix || '*'}/demo-content*`,
      ...(!prefix && additionalLocales
        ? additionalLocales.split(',').map((lang) => `${lang}/*`)
        : [])
    ].join(','),
    ...(prefix ? { starts_with: `${prefix}/` } : {})
  }
  const { getBrowserStories } = await import(
    '../../utils/storyblok/browserClient'
  )
  const { data } = await getBrowserStories(params)
  return (data.stories || []) as SearchStory[]
}

export const searchStoryTitle = (story: SearchStory) =>
  story.content.preview_title ||
  story.content.title ||
  story.content.meta_title ||
  story.name ||
  ''

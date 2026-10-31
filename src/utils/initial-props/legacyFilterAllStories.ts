import { matchesAllTags } from './matchesAllTags'
import { ListWidgetStoryblok } from '../../typings/generated/components-schema'
import { PageComponent } from '../../typings/generated/schema'
import { ISbStoryData } from 'storyblok-js-client'

type FilterOptions = Pick<
  ListWidgetStoryblok,
  | 'tags'
  | 'match_all_tags'
  | 'sort'
  | 'sort_descending'
  | 'maximum_items'
  | 'only_tagged'
>
type FilterStory = Pick<ISbStoryData<PageComponent>, 'name'> &
  Partial<
    Pick<
      ISbStoryData<PageComponent>,
      'tag_list' | 'published_at' | 'created_at'
    >
  > & {
    content: Pick<PageComponent, 'preview_publish_date' | 'preview_title'>
  }

export const legacyFilterAllStories = <T extends FilterStory>(
  content: FilterOptions,
  allStories: T[]
): T[] => {
  const filter = (content.tags && content.tags.values) || []
  const selectedTags = new Set(filter)
  const requiredTags = content.match_all_tags ? selectedTags : null
  const { sort } = content
  const sortDescending = content.sort_descending
  const stories = (allStories || [])
    .filter((item) => {
      const itemCategories = item.tag_list || []
      if (filter.length) {
        return requiredTags
          ? matchesAllTags(itemCategories, requiredTags)
          : itemCategories.some((tag) => selectedTags.has(tag))
      }
      if (content.only_tagged) {
        return !!itemCategories.length
      }
      return true
    })
    .sort((a, b) => {
      let sortACriteria = a.published_at
      let sortBCriteria = b.published_at
      const itemContentA = a.content
      const itemContentB = b.content
      if (sort === 'created') {
        sortACriteria = a.created_at
        sortBCriteria = b.created_at
      } else if (sort === 'updated') {
        sortBCriteria = b.published_at
        sortACriteria = a.published_at
      } else if (sort === 'publish') {
        sortACriteria = itemContentA.preview_publish_date || a.published_at
        sortBCriteria = itemContentB.preview_publish_date || b.published_at
      } else if (sort === 'title') {
        sortACriteria = String(
          itemContentA.preview_title || a.name
        ).toLowerCase()
        sortBCriteria = String(
          itemContentB.preview_title || b.name
        ).toLowerCase()
      }
      if (String(sortACriteria) < String(sortBCriteria)) {
        return sortDescending ? +1 : -1
      }
      if (String(sortACriteria) > String(sortBCriteria)) {
        return sortDescending ? -1 : 1
      }
      return 0
    })
  if (content.maximum_items) {
    return stories.slice(0, Number(content.maximum_items))
  }
  return stories
}

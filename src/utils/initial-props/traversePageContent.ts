import { StoryData } from 'storyblok-js-client'
import {
  ListWidgetStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import {
  CategoryComponent,
  PageComponent
} from '../../typings/generated/schema'

const listWidgetFilter = (
  content: ListWidgetStoryblok,
  allStories: StoryData<PageComponent>[]
) => {
  const filter = (content.tags && content.tags.values) || []
  const sort = content.sort
  const sortDescending = content.sort_descending
  const stories = (allStories || [])
    .filter((item) => {
      const itemCategories = item.tag_list || []
      if (filter.length) {
        return content.match_all_tags
          ? filter.every((element) => itemCategories.includes(element))
          : filter.some((element) => itemCategories.includes(element))
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
    return stories.slice(0, content.maximum_items)
  }
  return stories
}

export const traversePageContent = (
  page: PageStoryblok,
  lookup = 'list_widget'
) => {
  if (!page) {
    return []
  }
  const listWidgets: any[] = []
  const walkArray = (elements: any[]) => {
    elements.forEach((item) => {
      if (item.component === lookup) {
        listWidgets.push(item)
      } else if (Array.isArray(item.body)) {
        walkArray(item.body)
      }
    })
  }

  if (Array.isArray(page.body)) {
    walkArray(page.body)
  }
  if (Array.isArray(page.right_body)) {
    walkArray(page.right_body)
  }
  return listWidgets
}

// const prepareListStory = (listParams: ListWidgetStoryblok, allCategories: StoryData<CategoryComponent>[], locale?: string) => {
//   console.log(listParams)
//   const categories = Array.isArray(listParams.categories) && allCategories.filter(i => listParams.categories.includes(i.uuid))
//   console.log(categories)
//   const params: StoriesParams = {
//     per_page: listParams.maximum_items || 25,
//     excluding_fields: 'body,right_body,meta_robots,property,meta_description,seo_body',
//     sort_by: 'published_at:desc',
//     filter_query: {
//       'component': {
//         'in': 'page'
//       }
//     }
//   }
//   if (CONFIG.rootDirectory) {
//     params.starts_with = `${CONFIG.rootDirectory}/`
//   } else if (locale) {
//     params.starts_with = `${locale}/`
//   }
//
// }

export const collectComponentData = async (
  page: PageStoryblok,
  _allCategories: StoryData<CategoryComponent>[],
  allStories: StoryData<PageComponent>[] = [],
  _locale?: string
) => {
  const listWidgets = traversePageContent(page)
  const listData: { [k: string]: StoryData<PageComponent>[] } = {}
  listWidgets.forEach((item) => {
    listData[item._uid] = listWidgetFilter(item, allStories)
  })
  if (listWidgets.length !== Object.keys(listData).length) {
    // make sure list widgets are all fetched and merged correctly (_uid might not be unique)
    console.error('list widget has identical _uid')
  }

  return listData
}

import { StoryData } from 'storyblok-js-client'
import {
  FormStoryblok,
  ListWidgetStoryblok,
  PageStoryblok,
  RowStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { PageComponent } from '../../typings/generated/schema'
import { AppPageProps } from '../../typings/app'
import parseHijackedFormData from '../hooks/googleForms/parseHijackedFormData'
import { fetchGoogleFormData } from './fetchGoogleFormData'

export const listWidgetFilter = (
  content: ListWidgetStoryblok,
  allStories: StoryData<PageComponent>[]
) => {
  const filter = (content.tags && content.tags.values) || []
  const { sort } = content
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
  page: PageStoryblok | (RowStoryblok | SectionStoryblok)[],
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
  if (Array.isArray(page)) {
    walkArray(page)
  } else {
    if (Array.isArray(page.body)) {
      walkArray(page.body)
    }
    if (Array.isArray(page.right_body)) {
      walkArray(page.right_body)
    }
  }
  return listWidgets
}

export const processListWidgetData = async (props: AppPageProps) => {
  if (props.page) {
    const listWidgets = traversePageContent(props.page)
    const listData: { [k: string]: StoryData<PageComponent>[] } = {}
    listWidgets.forEach((item) => {
      listData[item._uid] = listWidgetFilter(item, props.allStories)
    })
    if (listWidgets.length !== Object.keys(listData).length) {
      // make sure list widgets are all fetched and merged correctly (_uid might not be unique)
      console.error('list widget has identical _uid')
    }
    if (Object.keys(listData).length) {
      Object.assign(props, { listWidgetData: listData })
    }
  }
}

export const processFormData = async (props: AppPageProps) => {
  if (props.page) {
    const formEl = [
      ...traversePageContent(props.page, 'form'),
      ...traversePageContent(props.settings?.footer as any, 'form')
    ] as FormStoryblok[]
    const formData: { [k: string]: any } = {}
    // eslint-disable-next-line no-restricted-syntax
    for (const formProps of formEl) {
      if (formProps.api) {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetchGoogleFormData(formProps.api)
        const parsedData = parseHijackedFormData(res)
        formData[formProps._uid] = parsedData
      }
    }
    if (Object.keys(formData).length) {
      Object.assign(props, { formData })
    }
  }
}

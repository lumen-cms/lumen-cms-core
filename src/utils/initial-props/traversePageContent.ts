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
import parseHijackedFormData, {
  GoogleFormDataProps
} from '../hooks/googleForms/parseHijackedFormData'
import { fetchGoogleFormData } from './fetchGoogleFormData'
import { LmStoryblokService } from './StoryblokService'
import { LmListWidgetProps } from '../../components/list-widget/listWidgetTypes'
import { getListWidgetParams } from '../universal/getListWidgetParams'

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

export const traversePageContent = async (
  page: PageStoryblok | (RowStoryblok | SectionStoryblok)[],
  lookup = 'list_widget',
  callback: (item: any) => Promise<any>
) => {
  if (!page) {
    return //[]
  }
  // const listWidgets: any[] = []
  const walkArray = async (elements: any[]) => {
    for (const item of elements) {
      if (item.component === lookup) {
        item[lookup + '_data'] = await callback(item)
        // listWidgets.push(item)
      } else if (Array.isArray(item.body)) {
        await walkArray(item.body)
      }
    }
  }
  if (Array.isArray(page)) {
    await walkArray(page)
  } else {
    if (Array.isArray(page.body)) {
      await walkArray(page.body)
    }
    if (Array.isArray(page.right_body)) {
      await walkArray(page.right_body)
    }
  }
}

export const processListWidgetData = async (props: AppPageProps) => {
  if (props.page) {
    const callback = async (
      item: ListWidgetStoryblok
    ): Promise<LmListWidgetProps['content']['list_widget_data']> => {
      const params = getListWidgetParams(item, {
        locale: props.locale,
        defaultLocale: props.defaultLocale
      })
      const storyData = await LmStoryblokService.get('cdn/stories', params)
      return {
        items: storyData.data.stories || [],
        total: storyData.total,
        perPage: storyData.perPage,
        cv: storyData.data.cv
      }
    }

    await traversePageContent(props.page, 'list_widget', callback)
  }
}

export const processFormData = async (props: AppPageProps) => {
  if (props.page) {
    const callback = async (
      formProps: FormStoryblok
    ): Promise<GoogleFormDataProps | undefined> => {
      if (!formProps.api) {
        return
      }
      const res = await fetchGoogleFormData(formProps.api)
      const parsedData = parseHijackedFormData(res)
      return parsedData
    }
    await Promise.all([
      traversePageContent(props.page, 'form', callback),
      traversePageContent(props.settings?.footer as any, 'form', callback)
    ])
  }
}

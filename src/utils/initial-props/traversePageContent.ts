import {
  CategoryBoxStoryblok,
  FormStoryblok,
  ListWidgetStoryblok,
  PageStoryblok,
  RowStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { AppPageProps } from '../../typings/app'
import parseHijackedFormData, {
  GoogleFormDataProps
} from '../hooks/googleForms/parseHijackedFormData'
import { fetchGoogleFormData } from './fetchGoogleFormData'
import { LmStoryblokService } from './StoryblokService'
import { LmListWidgetProps } from '../../components/list-widget/listWidgetTypes'
import { getListWidgetParams } from '../universal/getListWidgetParams'
import { legacyAllStories } from './legacyAllStories'
import { legacyFilterAllStories } from './legacyFilterAllStories'
import { filterAllCategory, getAllCategories } from './allCategoryStories'

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
      if (process.env.NEXT_PUBLIC_CATEGORIES_LEGACY) {
        // legacy code for BI and all projects where category is not part of the page schema
        const allStories = await legacyAllStories({
          locale: props.locale as string,
          defaultLocale: props.defaultLocale
        })
        const filtered = legacyFilterAllStories(item, allStories)
        return {
          items: filtered,
          total: filtered.length,
          cv: Date.now(),
          perPage: filtered.length
        }
      } else {
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
      return parseHijackedFormData(res)
    }
    await Promise.all([
      traversePageContent(props.page, 'form', callback),
      traversePageContent(props.settings?.footer as any, 'form', callback)
    ])
  }
}

export const processCategoryData = async (props: AppPageProps) => {
  const callback = async (item: CategoryBoxStoryblok) => {
    const allItems = await getAllCategories({
      locale: props.locale as string,
      defaultLocale: props.defaultLocale
    })
    return filterAllCategory(allItems, item)
  }
  if (props.page) {
    await traversePageContent(props.page, 'category_box', callback)
  }
}

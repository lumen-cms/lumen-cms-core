import {
  CategoryBoxStoryblok,
  FormStoryblok,
  ListWidgetStoryblok,
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
import { SSR_CONFIG } from '@SSR_CONFIG'

export const fetchComponentData = async (
  props: AppPageProps | (RowStoryblok | SectionStoryblok)[]
) => {
  const walkArray = async (elements: any[]) => {
    for (const item of elements) {
      const callback = SSR_CONFIG.ssrHooks.componentData[item.component]
      if (typeof callback === 'function') {
        item[item.component + '_data'] = await callback(item, props)
        // listWidgets.push(item)
      } else if (Array.isArray(item.body)) {
        await walkArray(item.body)
      }
    }
  }
  if (Array.isArray(props)) {
    await walkArray(props)
  } else {
    if (props.page) {
      if (Array.isArray(props.page.body)) {
        await walkArray(props.page.body)
      }
      if (Array.isArray(props.page.right_body)) {
        await walkArray(props.page.right_body)
      }
    }
    if (props.settings?.footer && Array.isArray(props.settings.footer)) {
      await walkArray(props.settings.footer)
    }
  }
}

export const listWidgetGetData = async (
  item: ListWidgetStoryblok,
  props: AppPageProps
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

export const googleFormGetData = async (
  formProps: FormStoryblok
): Promise<GoogleFormDataProps | undefined> => {
  if (!formProps.api) {
    return
  }
  const res = await fetchGoogleFormData(formProps.api)
  return parseHijackedFormData(res)
}

export const getCategoryData = async (
  item: CategoryBoxStoryblok,
  props: AppPageProps
) => {
  const allItems = await getAllCategories({
    locale: props.locale as string,
    defaultLocale: props.defaultLocale
  })
  return filterAllCategory(allItems, item)
}

import { ListWidgetStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { LmListWidgetProps } from '../../../components/list-widget/listWidgetTypes'
import { legacyAllStories } from '../legacyAllStories'
import { legacyFilterAllStories } from '../legacyFilterAllStories'
import { getListWidgetParams } from '../../universal/getListWidgetParams'
import { LmStoryblokService } from '../StoryblokService'

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

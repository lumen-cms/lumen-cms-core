import { ListWidgetStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { LmListWidgetProps } from '../../../components/list-widget/listWidgetTypes'
import { legacyAllStories } from '../legacyAllStories'
import { legacyFilterAllStories } from '../legacyFilterAllStories'

export const listWidgetGetData = async (
  item: ListWidgetStoryblok,
  props: AppPageProps
): Promise<LmListWidgetProps['content']['list_widget_data']> => {
  // legacy code for BI and all projects where category is not part of the page schema
  const allStories = await legacyAllStories({
    locale: props.locale || '',
    defaultLocale: props.defaultLocale || ''
  })
  const filtered = legacyFilterAllStories(item, allStories)
  return {
    items: filtered,
    total: filtered.length,
    cv: Date.now(),
    perPage: filtered.length
  }
}

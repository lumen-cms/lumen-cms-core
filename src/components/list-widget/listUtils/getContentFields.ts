import { ListStoriesData } from '../listWidgetTypes'
import { getDateLocalized } from '../../../utils/intlDateHelper'
import { StoryData } from 'storyblok-js-client'
import {
  CategoryStoryblok,
  DateTimeFormatStoryblok
} from '../../../typings/generated/components-schema'

export const getContentFields = (
  content: ListStoriesData,
  options: {
    date_format?: DateTimeFormatStoryblok[]
    hide_category?: boolean
    locale?: string
  }
) => {
  let publishedAt =
    content.content.published ||
    content.content.preview_publish_date ||
    content.content.start

  const getCategories = () => {
    return (
      content.content.category?.content?.name ??
      content.content.categories
        ?.map((i: StoryData<CategoryStoryblok>) => i.content?.name)
        .filter((i: any) => i)
        .join(', ')
    )
  }
  return {
    image: content.content.preview_image || content.content.image?.filename,
    title:
      content.content.title ||
      content.content.preview_title ||
      content.content.meta_title ||
      content.name,
    description:
      content.content.description ||
      content.content.preview_teaser ||
      content.content.meta_description,
    subtitle: [
      publishedAt
        ? getDateLocalized({
            start: publishedAt,
            end: content.content.end || null,
            locale: options.locale,
            options: options.date_format?.[0]
          })
        : content.content.preview_subtitle,
      options.hide_category ? null : getCategories()
    ]
      .filter((i) => i)
      .join(' - ')
  }
}

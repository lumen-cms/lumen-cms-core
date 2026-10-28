import { ListStoriesData } from '../listWidgetTypes'
import { getDateLocalized } from '../../../utils/intlDateHelper'
import { DateTimeFormatStoryblok } from '../../../typings/generated/components-schema'
import { ISbStoryData } from 'storyblok-js-client'
import type { StoryblokAsset } from '../../../typings/storyblok'

// Shared preview fields across page, news, and event content. Structural typing
// preserves the existing fallback order without reading unknown union fields.
interface PreviewFields {
  published?: string
  preview_publish_date?: string
  start?: string
  end?: string
  category?: string | ISbStoryData<{ component: string; name?: unknown }>
  categories?: (string | ISbStoryData<{ component: string; name?: unknown }>)[]
  image?: StoryblokAsset
  preview_image?: string
  title?: string
  preview_title?: string
  meta_title?: string
  description?: string
  preview_teaser?: string
  meta_description?: string
  preview_subtitle?: string
}

export const getContentFields = (
  content: ListStoriesData,
  options: {
    date_format?: DateTimeFormatStoryblok[]
    hide_category?: boolean
    locale?: string
  }
) => {
  const fields: PreviewFields = content.content
  const publishedAt =
    fields.published || fields.preview_publish_date || fields.start

  const categoryName = (category: PreviewFields['category']) => {
    const name =
      category && typeof category === 'object'
        ? category.content?.name
        : undefined
    return typeof name === 'string' ? name : undefined
  }
  const getCategories = () =>
    categoryName(fields.category) ??
    fields.categories?.map(categoryName).filter(Boolean).join(', ')
  return {
    image: fields.preview_image || fields.image?.filename,
    title:
      fields.title || fields.preview_title || fields.meta_title || content.name,
    description:
      fields.description || fields.preview_teaser || fields.meta_description,
    subtitle: [
      publishedAt
        ? getDateLocalized({
            start: publishedAt,
            end: fields.end || undefined,
            locale: options.locale,
            options: options.date_format?.[0]
          })
        : fields.preview_subtitle,
      options.hide_category ? null : getCategories()
    ]
      .filter((i) => i)
      .join(' - ')
  }
}

import { AppPageProps } from '../../typings/app'
import { localeStoriesHelper } from '../initial-props/component-data/localeStoriesHelper'
import {
  ListStoriesStoryblok,
  ListWidgetStoryblok
} from '../../typings/generated/components-schema'
import { ISbStoriesParams } from 'storyblok-js-client/types/interfaces'

export const excludingFieldsForLists =
  'body,right_body,property,meta_title,meta_description,seo_body,preview_title,preview_subtitle,preview_image,preview_teaser'

export const excludeListForStories =
  'body,right_body,meta_robots,property,meta_description,seo_body'
export const defaultResolveRelations =
  'static_section.container,form_container.form,event.category,news.category,page.categories'
// keep in sync with defaultResolveRelations
export const resolveLookup = {
  page: 'categories',
  news: 'category',
  event: 'category',
  form_container: 'form',
  static_section: 'container'
}
export const rootParams: ISbStoriesParams = {
  resolve_links: 'url',
  resolve_relations: defaultResolveRelations
}

export const getStoriesDefaultParams = (
  props: AppPageProps
): ISbStoriesParams => {
  const params: ISbStoriesParams = {
    ...rootParams,
    excluding_fields: excludeListForStories,
    ...localeStoriesHelper(props)
  }
  return params
}

export const getStoriesSortHelper = ({
  sort,
  sort_descending
}: ListWidgetStoryblok | ListStoriesStoryblok) => {
  const sortOrder = sort_descending ? 'desc' : 'asc'
  let sortBy = `published_at:desc`
  if (sort === 'created') {
    sortBy = `created_at:${sortOrder}`
  } else if (sort === 'updated') {
    sortBy = `updated_at:${sortOrder}`
  } else if (sort === 'publish') {
    sortBy = `content.preview_publish_date:${sortOrder},published_at:desc`
  } else if (sort === 'title') {
    sortBy = `content.preview_title:${sortOrder},content.meta_title:${sortOrder},name:${sortOrder}`
  }
  return sortBy
}

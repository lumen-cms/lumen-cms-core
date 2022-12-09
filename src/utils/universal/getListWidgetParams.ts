import { CONFIG } from '@CONFIG'
import { ListWidgetStoryblok } from '../../typings/generated/components-schema'
import { queryStringify } from './paramsToQueryString'
import { getStoriesSortHelper } from './storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client'

export const getListWidgetParams = (
  item: ListWidgetStoryblok,
  props: { locale?: string | null; defaultLocale?: string }
) => {
  const locale = props.locale !== props.defaultLocale ? props.locale : null

  const params: ISbStoriesParams = {
    per_page: item.maximum_items || 25,
    excluding_fields:
      'body,right_body,meta_robots,property,meta_description,seo_body',
    sort_by: getStoriesSortHelper(item),
    filter_query: {
      component: {
        in: 'page'
      }
    }
  }
  if (item.tags?.values?.length) {
    params.with_tag = item.tags.values.join(',')
  }
  if (item.categories?.length) {
    // @ts-ignore
    params.filter_query.categories = {
      [item.match_all_tags ? 'all_in_array' : 'in_array']:
        item.categories.join(',')
    }
  }
  if (CONFIG.rootDirectory || locale) {
    params.starts_with = `${locale ? `${locale}/` : ''}${
      CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
    }`
  }
  return params
}

export const getQueryStringOfParams = (
  item: ListWidgetStoryblok,
  props: { locale?: string | null; defaultLocale?: string }
) => {
  const params = getListWidgetParams(item, props)
  const checked = queryStringify(params)
  return checked
}

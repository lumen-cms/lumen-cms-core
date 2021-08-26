import { AppPageProps } from '../../typings/app'
import { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'

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
export const rootParams: StoriesParams = {
  resolve_links: 'url',
  resolve_relations: defaultResolveRelations
}

export const getStoriesDefaultParams = (props: AppPageProps): StoriesParams => {
  const locale = props.locale !== props.defaultLocale ? props.locale : null
  const params: StoriesParams = {
    ...rootParams
  }
  if (CONFIG.rootDirectory || locale) {
    params.starts_with = `${locale ? `${locale}/` : ''}${
      CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
    }`
  }
  return params
}

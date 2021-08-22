import { AppPageProps } from '../../typings/app'
import { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'

export const rootParams: StoriesParams = {
  resolve_links: 'url',
  resolve_relations:
    'static_section.container,form_container.form,event.category,news.category'
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

import { CONFIG } from '@CONFIG'
import { AppPageProps } from '../../../typings/app'
import { ISbStoriesParams } from 'storyblok-js-client'

export const localeStoriesHelper = (props: AppPageProps): ISbStoriesParams => {
  const locale =
    props.locale !== props.defaultLocale || CONFIG.enableLocaleSuffix
      ? props.locale
      : undefined
  const params: ISbStoriesParams = { starts_with: '' }
  if (locale) {
    if (!CONFIG.fieldLevelTranslation) {
      params.starts_with = `${locale}/`
    } else {
      params.language = locale
    }
  }
  if (CONFIG.rootDirectory) {
    params.starts_with += `${CONFIG.rootDirectory}/`
  }
  if (Array.isArray(props.locales) && props.locales.length > 1 && !locale) {
    params.excluding_slugs = props.locales
      .filter((i) => i !== props.defaultLocale)
      .map((i) => `${i}/*`)
      .join(',')
  }
  if (!params.starts_with) {
    delete params.starts_with
  }
  return params
}

import { CONFIG } from '@CONFIG'
import { StoriesParams } from 'storyblok-js-client'

export const localeStoriesHelper = (locale?: string | null): StoriesParams => {
  const params: StoriesParams = { starts_with: '' }
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
  if (!params.starts_with) {
    delete params.starts_with
  }
  return params
}

import { CONFIG } from '../config'
import { PagePropsOptions } from '../../typings/app'

export const prepareForStoryblok = (
  slug: string | string[] = 'home',
  options: PagePropsOptions
) => {
  const { rootDirectory } = CONFIG
  const slugAsArray = Array.isArray(slug)
    ? [...slug]
    : [slug.replace(/^\/+|\/+$/g, '')]

  if (options?.defaultLocale === slugAsArray?.[0]) {
    slugAsArray.shift() // remove default locale from array
  }
  if (
    slugAsArray.length === 1 &&
    (options.locales?.includes(slugAsArray[0]) || !slugAsArray[0] || slugAsArray[0] === '/')
  ) {
    // we add home and remove the lang identifier
    slugAsArray.shift()
    slugAsArray.push('home')
  }
  if (!slugAsArray.length) {
    slugAsArray.push('home')
  }
  /**
   * remove all locale parts because they are handled inside of delivery resolver
   */
  if (options.locales?.includes(slugAsArray?.[0])) {
    slugAsArray.shift() // first remove if part of slug we handle the locale in delivery resolver
  }
  if (options.locales?.includes(slugAsArray?.[0])) {
    slugAsArray.shift() // remove again if part of slug, this might happen
  }
  if (rootDirectory) {
    // if the first entry is not root directory append root directory
    const rootParts = rootDirectory.split('/').filter(Boolean)
    if (!rootParts.every((part, index) => slugAsArray[index] === part)) slugAsArray.unshift(...rootParts)
  }

  const pageSlug = slugAsArray.join('/')

  return {
    pageSlug
  }
}

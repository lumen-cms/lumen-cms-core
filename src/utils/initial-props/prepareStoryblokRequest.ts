import { CONFIG } from '@CONFIG'
import { PagePropsOptions } from '../../typings/app'

const { rootDirectory } = CONFIG

export const prepareForStoryblok = (
  slug: string | string[] = 'home',
  options: PagePropsOptions
) => {
  const slugAsArray = Array.isArray(slug) ? slug : [slug]
  const [first] = slugAsArray

  if (options?.defaultLocale === slugAsArray?.[0]) {
    slugAsArray.shift() // remove default locale from array
  }
  if (
    slugAsArray.length === 1 &&
    (options.locales?.includes(first) || !first || first === '/')
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
    first !== rootDirectory && slugAsArray.unshift(rootDirectory)
  }

  const pageSlug = slugAsArray.join('/')

  return {
    pageSlug
  }
}

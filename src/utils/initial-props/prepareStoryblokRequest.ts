import { CONFIG } from '@CONFIG'

export const prepareForStoryblok = (
  slug: string | string[] = 'home',
  insideStoryblok?: boolean
) => {
  let knownLocale
  let isLandingPage
  const slugAsArray = Array.isArray(slug) ? slug : [slug]

  const { rootDirectory } = CONFIG
  const [first, second] = slugAsArray
  if (rootDirectory) {
    // if the first entry is not root directory append root directory
    first !== rootDirectory && slugAsArray.unshift(rootDirectory)
  } else if (!!CONFIG.suppressSlugLocale && !insideStoryblok) {
    // suppress slug locale so remove any language key from the array (mainly for storyblok backend)
    if (CONFIG.languages.includes(first)) {
      // first directory is a locale
      if (slugAsArray.length === 1) {
        // landing pages of locale
        ;[knownLocale] = slugAsArray
        isLandingPage = true
        slugAsArray.push('home') // add 'home'
      } else if (slugAsArray.length === 2 && second === 'home') {
        // landing pages of locale (storyblok)
        knownLocale = first
        isLandingPage = true
      } else {
        slugAsArray.shift() // remove locale from path
      }
    }
  } else if (CONFIG.languages.includes(first)) {
    // activated multi lang handling
    knownLocale = first
    if (slugAsArray.length === 1) {
      slugAsArray.push('home')
    }
  }

  const pageSlug = slugAsArray.join('/')
  return {
    pageSlug,
    knownLocale,
    isLandingPage
  }
}

import { CONFIG } from '@CONFIG'
import { PagePropsOptions } from '../../typings/app'

const { rootDirectory } = CONFIG

export const prepareForStoryblok = (
  slug: string | string[] = 'home',
  options: PagePropsOptions
) => {
  const slugAsArray = Array.isArray(slug) ? slug : [slug]
  const [first] = slugAsArray
  if (rootDirectory) {
    // if the first entry is not root directory append root directory
    first !== rootDirectory && slugAsArray.unshift(rootDirectory)
  } else if (options.locales?.includes(first)) {
    if (slugAsArray.length === 1) {
      // we add home and remove the lang identifier
      slugAsArray.shift()
      slugAsArray.push('home')
    }
  }
  const pageSlug = slugAsArray.join('/')
  console.log(pageSlug, slugAsArray, options)
  return {
    pageSlug
  }
}

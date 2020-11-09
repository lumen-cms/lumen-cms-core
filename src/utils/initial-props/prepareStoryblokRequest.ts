import { CONFIG } from '@CONFIG'
import { PagePropsOptions } from '../../typings/app'

export const prepareForStoryblok = (
  slug: string | string[] = 'home',
  options: PagePropsOptions
) => {
  const slugAsArray = Array.isArray(slug) ? slug : [slug]
  const { rootDirectory } = CONFIG
  const [first] = slugAsArray
  if (rootDirectory) {
    // if the first entry is not root directory append root directory
    first !== rootDirectory && slugAsArray.unshift(rootDirectory)
  } else if (options.locales?.includes(first)) {
    if (slugAsArray.length === 1) {
      slugAsArray.push('home')
    }
  }
  const pageSlug = slugAsArray.join('/')
  return {
    pageSlug
  }
}

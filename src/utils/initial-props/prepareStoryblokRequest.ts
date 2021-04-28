import { CONFIG } from '@CONFIG'
import { PagePropsOptions } from '../../typings/app'

export const prepareForStoryblok = (
  slug: string | string[] = 'home',
  options: PagePropsOptions
) => {
  const { rootDirectory } = CONFIG
  const slugAsArray = Array.isArray(slug) ? slug : [slug]
  const [first] = slugAsArray
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
  if (rootDirectory) {
    // if the first entry is not root directory append root directory
    first !== rootDirectory && slugAsArray.unshift(rootDirectory)
  }

  const pageSlug = slugAsArray.join('/')

  return {
    pageSlug
  }
}

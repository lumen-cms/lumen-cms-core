import { CONFIG } from '@CONFIG'

export const internalLinkHandler = (url: string) => {
  const urlArray = url.split('/')
  let processedUrl = url
  if (CONFIG.rootDirectory) {
    if (urlArray[0] === CONFIG.rootDirectory) {
      urlArray.shift()
      processedUrl = urlArray.join('/')
    }
  } else if (CONFIG.suppressSlugLocale) {
    if (
      urlArray.length > 1 &&
      CONFIG.languages.includes(urlArray[0]) &&
      urlArray[1] !== 'home'
    ) {
      urlArray.shift()
      processedUrl = urlArray.join('/')
    }
  }
  return processedUrl.startsWith('/') ? processedUrl : `/${processedUrl}`
}

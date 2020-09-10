import { CONFIG } from './config'
import { getGlobalState } from './state/state'

export interface LinkType {
  cached_url?: string
  linktype?: string
  nextHref?: string
  id?: string
  anchor?: string
  url?: string

  [k: string]: any
}

interface LinkOptions {
  openExternal?: boolean
}

export const homepageLinkHandler = () => {
  if (CONFIG.rootDirectory) {
    return '/home'
  }
  const appLocale = getGlobalState('locale')
  return appLocale && appLocale !== CONFIG.defaultLocale
    ? `/${appLocale}/home`
    : '/home'
}

/**
 * This handler needs to be in sync with lumen-cms-nextjs internalLinkHandler
 * @param url
 */
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

type LinkHandlerProps = {
  href?: string
  target?: string
  rel?: string
  external?: boolean
}

export const linkHandler = (
  link: LinkType,
  options: LinkOptions
): LinkHandlerProps => {
  const props: LinkHandlerProps = {
    href: '/'
  }
  const cachedUrl = link.cached_url
  if (!cachedUrl) {
    return {}
  }

  if (link.linktype === 'story') {
    props.href = internalLinkHandler(cachedUrl) + (link.anchor ? `#${link.anchor}` : '')
  } else {
    let href = cachedUrl || ''
    if (href.includes('@')) {
      href = `mailto:${href.replace('mailto:', '')}`
    } else if (href.includes('+')) {
      href = `tel:${href.replace('+', '')}`
    }

    if (options.openExternal) {
      props.target = '_blank'
      props.rel = 'noopener noreferrer'
    }
    props.external = true
    props.href = href
  }
  return props
}

export const getLinkAttrs = (
  link: LinkType = {} as LinkType,
  options: LinkOptions = {}
): LinkHandlerProps => {
  return linkHandler(link, options)
}

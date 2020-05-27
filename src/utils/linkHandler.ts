import { CONFIG } from './config'
import { LinkProps } from 'next/link'
import { getGlobalState } from './state/state'

export interface LinkType {
  cached_url: string
  linktype: string
  nextHref?: string

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
  return appLocale && appLocale !== CONFIG.defaultLocale ? `/${appLocale}/home` : '/home'
}

export const internalLinkHandler = (url: string) => {
  if (CONFIG.rootDirectory) {
    const urlArray = url.split('/')
    if (urlArray[0] === CONFIG.rootDirectory) {
      urlArray.shift()
      url = urlArray.join('/')
    }
  } else if (CONFIG.suppressSlugLocale) {
    const urlArray = url.split('/')
    if (urlArray.length > 1 && CONFIG.languages.includes(urlArray[0]) && urlArray[1] !== 'home') {
      urlArray.shift()
      url = urlArray.join('/')
    }
  }
  return url.startsWith('/') ? url : `/${url}`
}

type LinkHandlerProps = {
  href: LinkProps['href']
  target?: string
  rel?: string
  external?: boolean
}

export const linkHandler = (link: LinkType, options: LinkOptions): LinkHandlerProps => {
  const props: LinkHandlerProps = {
    href: '/'
  }
  let cachedUrl = link.cached_url as string

  if (link.linktype === 'story') {
    props.href = internalLinkHandler(cachedUrl)
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

export const getLinkAttrs = (link: LinkType = {} as LinkType, options: LinkOptions = {}): LinkHandlerProps => {
  return linkHandler(link, options)
}

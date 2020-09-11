import { CONFIG } from './config'
import { getGlobalState } from './state/state'
import { internalLinkHandler } from 'lumen-cms-utils'

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

type LinkHandlerProps = {
  href?: string
  target?: string
  rel?: string
  external?: boolean
  download?: string
  email?: string
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
    if (link.email) {
      props.href = `mailto:${link.email.replace('mailto:', '')}`
      props.external = true
      return props
    }
    return {}
  }

  if (link.linktype === 'story') {
    props.href = internalLinkHandler(cachedUrl) + (link.anchor ? `#${link.anchor}` : '')
  } else if (link.linktype === 'asset') {
    props.href = cachedUrl
    props.download = cachedUrl
    props.external = true
    props.target = '_blank'
    props.rel = 'noopener noreferrer'
  } else {
    let href = cachedUrl || ''
    if (/\S+@\S+\.\S+/.test(href)) {
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

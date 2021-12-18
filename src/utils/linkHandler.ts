import { internalLinkHandler } from './internalLinkHandler'
import { ReactElement } from 'react'

export interface LinkType {
  cached_url?: string
  linktype?: 'url' | 'asset' | 'story' | 'email'
  fieldtype?: 'multilink'
  id?: string
  anchor?: string
  url?: string
  email?: string
  prep?: boolean
  story?: {
    name: string
    id: number
    uuid: string
    slug: string
    full_slug: string
    url: string
  }

  [k: string]: any
}

interface LinkOptions {
  openExternal?: boolean
}

export type LinkHandlerProps = {
  href?: string
  target?: string
  rel?: string
  external?: boolean
  download?: string
  email?: string
  naked?: boolean
  component?: ReactElement
}

export const linkHandler = (
  link: LinkType,
  options: LinkOptions
): LinkHandlerProps => {
  const props: LinkHandlerProps = {
    href: '/'
  }
  if (options?.openExternal) {
    props.target = '_blank'
  }
  const cachedUrl = link.story?.url || link.cached_url || link.email

  if (!cachedUrl) {
    return {}
  }

  if (link.linktype === 'story') {
    props.href =
      internalLinkHandler(cachedUrl) + (link.anchor ? `#${link.anchor}` : '')
  } else if (link.linktype === 'asset') {
    props.href = cachedUrl
    props.download = cachedUrl
    props.external = true
    props.target = '_blank'
    props.rel = 'noopener noreferrer'
  } else if (link.linktype === 'email') {
    props.href = `mailto:${link.email}`
    props.external = true
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
    props.external = !href.startsWith('#')
    props.href = href
  }
  return props
}

export const isValidLink = (link?: LinkType): boolean | string | undefined => {
  if (!link) {
    return false
  }
  if (link.prep && link?.linktype === 'story' && link?.cached_url) {
    return link.cached_url.split('/').filter((i) => i).length > 1
  }
  return link?.cached_url || link?.url || link?.email
}

export const getLinkAttrs = (
  link: LinkType = {} as LinkType,
  options: LinkOptions = {}
): LinkHandlerProps => {
  return linkHandler(link, options)
}

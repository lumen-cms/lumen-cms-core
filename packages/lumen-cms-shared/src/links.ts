import { publicStoryPath, type RouteConfig } from './server/routes'

export interface LinkConfig {
  rootDirectory?: string
  suppressSlugLocale?: boolean
  languages?: string[]
  fieldLevelTranslation?: boolean
  publicRoutes?: Pick<RouteConfig, 'locales' | 'defaultLocale'>
}

export const internalLinkHandler = (url: string, config: LinkConfig = {}) => {
  if (config.publicRoutes) return publicStoryPath(url, { ...config, ...config.publicRoutes })
  const urlArray = url.split('/')
  let processedUrl = url
  if (config.rootDirectory) {
    if (urlArray[0] === config.rootDirectory) {
      urlArray.shift()
      processedUrl = urlArray.join('/')
    }
  } else if (config.suppressSlugLocale) {
    if (
      urlArray.length > 1 &&
      config.languages?.includes(urlArray[0]) &&
      urlArray[1] !== 'home'
    ) {
      urlArray.shift()
      processedUrl = urlArray.join('/')
    }
  }
  return processedUrl.startsWith('/') ? processedUrl : `/${processedUrl}`
}

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

export interface LinkOptions {
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
}

export const linkHandler = (
  link: LinkType,
  options: LinkOptions,
  config: LinkConfig = {}
): LinkHandlerProps => {
  const props: LinkHandlerProps = {
    href: '/'
  }
  if (options?.openExternal) {
    props.target = '_blank'
  }
  // if we use field level translations the translated slug is in full_slug not url
  const storyUrl = config.fieldLevelTranslation
    ? link.story?.full_slug
    : link.story?.url
  const cachedUrl = storyUrl || link.cached_url || link.email

  if (!cachedUrl) {
    return {}
  }

  if (link.linktype === 'story') {
    props.href =
      internalLinkHandler(cachedUrl, config) + (link.anchor ? `#${link.anchor}` : '')
  } else if (link.linktype === 'asset') {
    props.href = cachedUrl
    props.download = cachedUrl
    props.external = true
    props.target = '_blank'
    props.rel = 'noopener noreferrer'
  } else if (link.linktype === 'email') {
    props.href = `mailto:${link.email || link.cached_url}`
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
  link: LinkType = {},
  options: LinkOptions = {},
  config: LinkConfig = {}
): LinkHandlerProps => {
  return linkHandler(link, options, config)
}

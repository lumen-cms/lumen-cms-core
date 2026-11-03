/** Public route policy shared by static builds, preview and sitemap generation. */
export interface RouteConfig {
  defaultLocale: string
  locales: readonly string[]
  rootDirectory?: string
  suppressSlugLocale?: boolean
  languages?: readonly string[]
}

export interface CmsRoute {
  params: { slug: string | undefined }
  props: { locale: string; defaultLocale: string; locales: string[]; cmsSlug: string }
}

/** CMS story links share the static route policy, retaining query/anchor suffixes. */
export function publicStoryPath(value: string, config: RouteConfig): string {
  const suffixIndex = value.search(/[?#]/)
  const slug = suffixIndex < 0 ? value : value.slice(0, suffixIndex)
  const suffix = suffixIndex < 0 ? '' : value.slice(suffixIndex)
  const [route] = createStaticRoutes([{ full_slug: slug }], config)
  return `/${route.params.slug || ''}${suffix}`
}

export function createStaticRoutes(
  stories: readonly { full_slug: string }[],
  config: RouteConfig
): CmsRoute[] {
  if (!config.locales.includes(config.defaultLocale)) {
    throw new Error('The default locale must be included in locales')
  }
  const routes = new Map<string, CmsRoute>()
  const add = (path: string, locale: string, cmsSlug: string) => {
    const slug = path.replace(/^\/+|\/+$/g, '') || undefined
    const previous = routes.get(slug || '')
    if (previous && previous.props.cmsSlug !== cmsSlug) {
      throw new Error(`Multiple CMS stories map to /${slug || ''}`)
    }
    routes.set(slug || '', {
      params: { slug },
      props: { locale, defaultLocale: config.defaultLocale, locales: [...config.locales], cmsSlug }
    })
  }
  for (const story of stories) {
    const parts = story.full_slug.split('/').filter(Boolean)
    const locale = config.locales.includes(parts[0]) ? parts.shift()! : config.defaultLocale
    const root = config.rootDirectory?.split('/').filter(Boolean) || []
    if (root.length && root.every((part, index) => parts[index] === part)) parts.splice(0, root.length)
    if (parts.at(-1) === 'home') parts.pop()
    const omitLocale = locale === config.defaultLocale || (
      config.suppressSlugLocale && config.languages?.includes(locale) && parts.length > 0
    )
    add([...(omitLocale ? [] : [locale]), ...parts].join('/'), locale, story.full_slug)
  }
  // Match the existing explicit locale-home entries even if the listing omits home.
  for (const locale of config.locales) {
    const path = locale === config.defaultLocale ? '' : locale
    if (!routes.has(path)) add(path, locale, [locale === config.defaultLocale ? '' : locale, config.rootDirectory, 'home'].filter(Boolean).join('/'))
  }
  return [...routes.values()]
}

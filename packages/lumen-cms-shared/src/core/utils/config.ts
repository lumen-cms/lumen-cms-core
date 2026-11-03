type AppConfigProps = {
  publicToken: string
  previewToken: string
  rootDirectory?: string
  overwriteLocale?: string
  enableLocaleSuffix?: boolean
  fieldLevelTranslation?: boolean
  suppressSlugLocale?: boolean
  suppressSlugIncludeDefault?: boolean
  overwriteDisableIndex?: boolean
  GA?: string
  TAWKTO?: string
  prefetch: boolean
  hostname?: string
  excluding_slugs?: string // exclude slugs for sitemap, getStaticPaths. wildcards allowed: "auth/*,demo-content/*"
  overwriteSettingsPaths: string[] // overwrite paths which are in route, add trailing slash: some/special/,other/special/
  languages: string[]
  authPathRequiredRoles?: {
    path: string
    roles: string[]
  }[]
  shopifyGql: string
  shopifyAccessToken: string
  redirects?: Map<string, string>
  [k: string]: any
}

export const CONFIG: AppConfigProps = {
  // Never publish draft credentials, including on preview deployments.
  previewToken:
    typeof window === 'undefined'
      ? process.env.STORYBLOK_PREVIEW_TOKEN || ''
      : '',
  // This must be a Storyblok Public token (published content only).
  publicToken: process.env.PUBLIC_STORYBLOK_TOKEN || '',
  rootDirectory: process.env.PUBLIC_ROOT_DIRECTORY,
  enableLocaleSuffix: !!process.env.PUBLIC_ENABLE_LOCALE_SUFFIX,
  fieldLevelTranslation: !!process.env.PUBLIC_FIELD_LEVEL_TRANSLATION,
  overwriteLocale: process.env.PUBLIC_OVERWRITE_LOCALE,
  suppressSlugLocale: !!process.env.PUBLIC_SUPPRESS_SLUG_LOCALE, // only in combination with PUBLIC_LANGUAGES
  overwriteDisableIndex: !!process.env.PUBLIC_OVERWRITE_DISABLE_INDEX,
  GA: process.env.PUBLIC_GA,
  languages: process.env.PUBLIC_LANGUAGES?.split(',') || [],
  TAWKTO: process.env.PUBLIC_TAWKTO,
  prefetch: !process.env.PUBLIC_DISABLE_PREFETCH,
  overwriteSettingsPaths:
    process.env.PUBLIC_OVERWRITE_SETTINGS_PATHS?.split(',') || [],
  excluding_slugs: process.env.PUBLIC_EXCLUDING_SLUGS || '',
  shopifyGql: process.env.PUBLIC_SHOPIFY_DOMAIN
    ? `https://${process.env.PUBLIC_SHOPIFY_DOMAIN}/api/2020-10/graphql.json`
    : '',
  shopifyAccessToken:
    process.env.PUBLIC_SHOPIFY_STOREFRONT_PUBLISHABLE_KEY || ''
}


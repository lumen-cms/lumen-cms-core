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
  publicToken: process.env.NEXT_PUBLIC_STORYBLOK_PUBLISHABLE_KEY || process.env.STORYBLOK_PUBLIC_TOKEN || '',
  rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
  enableLocaleSuffix: !!process.env.NEXT_PUBLIC_ENABLE_LOCALE_SUFFIX,
  fieldLevelTranslation: !!process.env.NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION,
  overwriteLocale: process.env.NEXT_PUBLIC_OVERWRITE_LOCALE,
  suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE, // only in combination with NEXT_PUBLIC_LANGUAGES
  overwriteDisableIndex: !!process.env.NEXT_PUBLIC_OVERWRITE_DISABLE_INDEX,
  GA: process.env.NEXT_PUBLIC_GA,
  languages: process.env.NEXT_PUBLIC_LANGUAGES?.split(',') || [],
  TAWKTO: process.env.NEXT_PUBLIC_TAWKTO,
  prefetch: !process.env.NEXT_PUBLIC_DISABLE_PREFETCH,
  overwriteSettingsPaths:
    process.env.NEXT_PUBLIC_OVERWRITE_SETTINGS_PATHS?.split(',') || [],
  excluding_slugs: process.env.NEXT_PUBLIC_EXCLUDING_SLUGS || '',
  shopifyGql: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2020-10/graphql.json`
    : '',
  shopifyAccessToken:
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_PUBLISHABLE_KEY || ''
}


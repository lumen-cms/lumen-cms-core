import { publicStoryPath } from './server/routes'
export interface SearchConfig {
 publicToken: string
 prefix?: string
 additionalLocales: string
 rootDirectory?: string
 suppressSlugLocale?: boolean
 languages: string[]
 locales?: string[]
 defaultLocale?: string
}
export function searchParams(term: string, config: SearchConfig) {
 const params = new URLSearchParams({ token: config.publicToken, version: 'published', per_page: '25', sort_by: 'content.preview_title:desc', 'filter_query[component][in]': 'page', excluding_fields: 'body,right_body,meta_robots,property,seo_body', search_term: term, excluding_slugs: ['demo-content*', `${config.prefix || '*'}/demo-content*`, ...(!config.prefix && config.additionalLocales ? config.additionalLocales.split(',').map(lang => `${lang}/*`) : [])].join(',') })
 if (config.prefix) params.set('starts_with', `${config.prefix}/`)
 return params
}
export type SearchLinkConfig = Pick<SearchConfig, 'rootDirectory' | 'suppressSlugLocale' | 'languages' | 'locales' | 'defaultLocale'>
export function searchLink(slug: string, config: SearchLinkConfig) {
 const defaultLocale = config.defaultLocale || config.locales?.[0] || config.languages[0] || 'en'
 const locales = config.locales?.length ? config.locales : [...new Set([defaultLocale, ...config.languages])]
 // Keep result destinations identical to the paths generated for public pages,
 // including locale homes and CMS root directories.
 return publicStoryPath(slug, { ...config, defaultLocale, locales })
}

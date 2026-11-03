import type { CmsTheme } from 'lumen-cms-shared/theme'
import type { AppPageProps } from 'lumen-cms-shared/core/typings/app'
import type { AllProductsQuery } from 'lumen-cms-shared/core/typings/generated/shopify-schema'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
import type { HTMLAttributes } from 'astro/types'
export interface AstroLinkProps extends HTMLAttributes<'a'> { context?: RenderContext }
/** Astro components receive content, context and the parent's layout props. */
export type AstroRendererOverrides = Readonly<Record<string, AstroComponentFactory | undefined>>
/** Outermost first; wrappers receive settings/context and render an Astro slot. */
export type AstroAppWrappers = readonly AstroComponentFactory[]
export interface RenderContext {
  theme: CmsTheme
  page: AppPageProps & { allShopifyProducts?: AllProductsQuery['products']['edges']; storyLinkIndex?: Record<string, string> }
  preview: boolean
  /** Render non-action button blocks as decoration inside native summaries. */
  decorativeButtons?: boolean
  components?: AstroRendererOverrides
  linkRenderer?: AstroComponentFactory
  storyListEndpoint?: string
}

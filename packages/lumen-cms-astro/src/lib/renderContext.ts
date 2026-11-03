import { createCmsTheme } from 'lumen-cms-shared/theme'
import type { RenderContext } from './context'

export const storyListEndpoint = '/api/story-list'
/** Shared by initial documents and pagination so theme and image layout agree. */
export function createRenderContext(page: RenderContext['page'], overrides: Partial<Omit<RenderContext, 'page' | 'theme' | 'preview'>> = {}): RenderContext {
 return {
  page,
  preview: !!page.insideStoryblok,
  theme: createCmsTheme(page.settings || undefined, { default: process.env.NEXT_PUBLIC_FONT_DEFAULT, ...Object.fromEntries([1,2,3,4].map(i => [`alt${i}`, process.env[`NEXT_PUBLIC_FONT_ALT${i}`]])) }),
  storyListEndpoint: page.insideStoryblok ? undefined : storyListEndpoint,
  ...overrides,
 }
}

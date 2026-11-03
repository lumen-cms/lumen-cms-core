import { createCmsTheme } from 'lumen-cms-shared/theme'
import type { RenderContext } from './context'

export const storyListEndpoint = '/api/story-list'
/** Shared by initial documents and pagination so theme and image layout agree. */
export function createRenderContext(page: RenderContext['page'], overrides: Partial<Omit<RenderContext, 'page' | 'theme' | 'preview'>> = {}): RenderContext {
 return {
  page,
  preview: !!page.insideStoryblok,
  theme: createCmsTheme(page.settings || undefined, { default: process.env.PUBLIC_FONT_DEFAULT, alt1: process.env.PUBLIC_FONT_ALT1, alt2: process.env.PUBLIC_FONT_ALT2, alt3: process.env.PUBLIC_FONT_ALT3, alt4: process.env.PUBLIC_FONT_ALT4 }),
  storyListEndpoint: page.insideStoryblok ? undefined : storyListEndpoint,
  ...overrides,
 }
}

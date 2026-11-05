import { expect, it } from 'vitest'
import { firstSectionBackground } from '../../packages/lumen-cms-astro/src/images/hero'
import type { RenderContext } from '../../packages/lumen-cms-astro/src/lib/context'

const background = { component: 'background', _uid: 'hero', image: 'https://a.storyblok.com/hero.jpg', alternative_image: 'https://a.storyblok.com/mobile.jpg', quality: '75' }
const section = { component: 'section', _uid: 'first', background: [background] }
const page = (body: unknown[]) => ({ page: { component: 'page', _uid: 'page', body } }) as RenderContext['page']
it('selects the same first section as the built-in page renderer', () => {
 expect(firstSectionBackground(page([null, section]))).toBe(background)
 expect(firstSectionBackground(page([{ component: 'section', _uid: 'empty' }, section]))).toBeUndefined()
 expect(firstSectionBackground(page([{ component: 'section_parallax', _uid: 'parallax' }, section]))).toBeUndefined()
})
it('does not speculate about custom renderers or breakpoint-hidden backgrounds', () => {
 const override = (() => {}) as unknown as NonNullable<RenderContext['components']>[string]
 expect(firstSectionBackground(page([section]), { page: override })).toBeUndefined()
 expect(firstSectionBackground(page([section]), { section: override })).toBeUndefined()
 expect(firstSectionBackground(page([{...section, background: [{...background, hide_image_on_breakpoint: 'xs'}]}]))).toBeUndefined()
})
it('supports an alternative-only background and skips empty backgrounds', () => {
 const alternate = {...background, image: undefined}
 expect(firstSectionBackground(page([{...section, background: [alternate]}]))).toBe(alternate)
 expect(firstSectionBackground(page([{...section, background: []}]))).toBeUndefined()
})

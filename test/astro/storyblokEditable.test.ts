// @vitest-environment happy-dom
import { afterEach, expect, it } from 'vitest'
import { initializeStoryblokEditable } from '../../packages/lumen-cms-astro/src/client/storyblokEditable'
afterEach(() => document.body.replaceChildren())
it('attaches official editor attributes to the rendered root without changing layout ancestry', () => {
 document.body.innerHTML = '<main><template data-lm-editable-start="a" data-lm-editable-uid="story-a" data-lm-editable-c="payload"></template><style>.row{display:flex}</style><section class="row"><div>Child</div></section><template data-lm-editable-end="a"></template></main>'
 initializeStoryblokEditable()
 const section = document.querySelector('section')!
 expect(section.parentElement?.tagName).toBe('MAIN')
 expect(section.getAttribute('data-blok-uid')).toBe('story-a')
 expect(section.getAttribute('data-blok-c')).toBe('payload')
 expect(section.className).toBe('row storyblok__outline')
})
it('does not claim a neighboring block when a disabled component renders nothing', () => {
 document.body.innerHTML = '<template data-lm-editable-start="a" data-lm-editable-uid="story-a"></template><template data-lm-editable-end="a"></template><section></section>'
 initializeStoryblokEditable()
 expect(document.querySelector('section')?.hasAttribute('data-blok-uid')).toBe(false)
})

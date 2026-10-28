import { expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { load } from 'cheerio'
import LmAccordionItem from './AccordionItem'

vi.mock('@LmComponentRender', () => ({
  LmComponentRender: ({
    content
  }: {
    content: { component: string; text?: string }
  }) =>
    content.component === 'headline' ? (
      <div>
        <button type="button" aria-label="website image">
          Image
        </button>
        <h3>{content.text}</h3>
      </div>
    ) : (
      <p>Course details</p>
    )
}))

it('preserves custom CMS headings and image buttons through browser HTML parsing', () => {
  const html = renderToStaticMarkup(
    <LmAccordionItem
      content={{
        _uid: 'course-objectives',
        component: 'accordion_item',
        title_custom: [
          {
            _uid: 'title',
            component: 'headline',
            text: 'Course Objectives',
            tag: 'h3'
          }
        ],
        body: [{ _uid: 'body', component: 'rich_text_editor' }]
      }}
      options={{ _uid: 'accordion', component: 'accordion', body: [] }}
      opened=""
      setOpen={() => {}}
      iteration={0}
    />
  )
  // parse5 (Cheerio's default) performs the same heading repair as a browser.
  const $ = load(html)
  expect($('h3')).toHaveLength(1)
  expect($('.MuiAccordion-heading .MuiAccordionSummary-root h3').text()).toBe(
    'Course Objectives'
  )
  expect($('.MuiAccordionDetails-root p').text()).toBe('Course details')
  expect(
    $('.MuiAccordionSummary-root button[aria-label="website image"]')
  ).toHaveLength(1)
  expect($('.MuiAccordionSummary-root').attr('role')).toBe('button')
  expect($('.MuiAccordionSummary-root').attr('tabindex')).toBe('0')
})

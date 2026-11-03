// Shared content for the actual React tabs and the production Astro renderer.
const body = ['First', 'Second', 'Third'].map((title, index) => ({
 component: 'tabs_item', _uid: `item-${index}`, title,
 body: [{ component: 'html', _uid: `body-${index}`, body: `<div data-parity-content style="height:${[120, 320, 180][index]}px">${title} panel <input aria-label="${title} input" value="initial"><a href="#example">${title} link</a></div>` }],
}))
const base = { component: 'tabs', _uid: 'parity', body, dynamic_height: true, mobile_breakpoint: 'sm', centered: true, wrapped: true, text_color: 'primary', indicator_color: 'secondary', text_style: [{ component: 'headline', _uid: 'label', typography: 'body1' }] }
export const tabFixtures = {
 horizontal: base,
 vertical: { ...base, vertical_tabs: true, tabs_width: '3', content_width: '9' },
 scrollable: { ...base, variant: 'scrollable', mobile_breakpoint: 'md', body: Array.from({ length: 12 }, (_, i) => ({ ...body[i % 3], _uid: `item-${i}`, title: `Long title ${i}` })) },
 single: { ...base, body: body.slice(0, 1), dynamic_height: false },
 empty: { ...base, body: [] },
}

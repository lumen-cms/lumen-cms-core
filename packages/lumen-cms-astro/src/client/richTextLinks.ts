/** Bind dynamic rich-text links into the same server-rendered shells as initial links. */
export function applyRichTextLinkTemplates(fragment: DocumentFragment, root: HTMLElement) {
 for (const source of [...fragment.querySelectorAll<HTMLAnchorElement>('a.lm-rich-link')]) {
  const target = source.target === '_blank' ? 'blank' : 'same'
  const template = root.querySelector<HTMLTemplateElement>(`template[data-story-rich-link="${target}"]`)
  if (!template) continue
  const replacement = template.content.cloneNode(true) as DocumentFragment
  const slot = replacement.querySelector('[data-rich-link-slot]')
  if (!slot) throw new Error('Custom rich-text link must preserve its content slot')
  const href = source.getAttribute('href') || ''
  for (const node of replacement.querySelectorAll('*')) {
   for (const attr of [...node.attributes]) if (attr.value.includes('__LM_RICH_HREF__')) node.setAttribute(attr.name, attr.value.replaceAll('__LM_RICH_HREF__', href))
  }
  // The template owns styling/structure; runtime attributes describe this link.
  const anchor = slot.closest('a')
  if (!anchor) throw new Error('Custom rich-text link must render an anchor around its slot')
  for (const name of ['target', 'rel', 'download']) {
   const value = source.getAttribute(name)
   if (value !== null) anchor.setAttribute(name, value)
  }
  slot.replaceWith(...source.childNodes)
  source.replaceWith(replacement)
 }
}

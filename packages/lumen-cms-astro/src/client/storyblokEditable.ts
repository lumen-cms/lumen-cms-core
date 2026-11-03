/** Match the legacy inert-marker strategy: editor selection adds no layout
 * wrappers, preserving grid/flex relationships and user-authored CSS selectors. */
export function initializeStoryblokEditable() {
 document.querySelectorAll<HTMLTemplateElement>('template[data-lm-editable-start]').forEach(marker => {
  let target = marker.nextElementSibling
  while (target && ['TEMPLATE', 'STYLE', 'SCRIPT'].includes(target.tagName)) {
   if (target.getAttribute('data-lm-editable-end') === marker.dataset.lmEditableStart) return
   target = target.nextElementSibling
  }
  if (!target) return
  for (const attribute of ['data-blok-c', 'data-blok-uid']) {
   const value = marker.getAttribute(attribute.replace('data-blok-', 'data-lm-editable-'))
   if (value) target.setAttribute(attribute, value)
  }
  target.classList.add('storyblok__outline')
 })
}

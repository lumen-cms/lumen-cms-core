import { fastSpringStore } from './fastspringProvider'
import { onUnmount } from './lifecycle'
import type { EcommerceFastspringProductStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
export function initializeFastSpringProducts() {
 document.querySelectorAll<HTMLElement>('[data-lm-fastspring-product]:not([data-initialized])').forEach(root => {
  root.dataset.initialized = 'true'
  const content: EcommerceFastspringProductStoryblok = JSON.parse(root.dataset.lmFastspringProduct!)
  const template = root.querySelector<HTMLTemplateElement>('template')!
  const target = root.querySelector<HTMLElement>('[data-fastspring-trigger]')!
  const store = fastSpringStore()
  const render = () => {
   const product = store.product(content.path)
   root.hidden = !product
   if (!product) { target.replaceChildren(); return }
   const replace = (value: string) => value.replaceAll('{price}', product.price || '').replaceAll('{total}', product.total || '').replaceAll('{discount}', product.unitDiscount || '')
   const fragment = template.content.cloneNode(true) as DocumentFragment
   const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT)
   while (walker.nextNode()) walker.currentNode.textContent = replace(walker.currentNode.textContent || '')
   fragment.querySelectorAll('[aria-label]').forEach(el => el.setAttribute('aria-label', replace(el.getAttribute('aria-label')!)))
   target.replaceChildren(fragment)
   if (!content.text_only && !target.querySelector('button,a')) { target.tabIndex = 0; target.setAttribute('role', 'button') }
  }
  root.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); store.checkout(content) })
  target.addEventListener('keydown', event => { if (event.target === target && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); store.checkout(content) } })
  const unsubscribe = store.subscribe(render)
  render(); onUnmount(root, unsubscribe)
 })
}

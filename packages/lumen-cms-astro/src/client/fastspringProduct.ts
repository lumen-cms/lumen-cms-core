import { fastSpringStore, commerceStatus, retryCommerce } from './fastspringProvider'
import { onUnmount } from './lifecycle'
import type { EcommerceFastspringProductStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
export function initializeFastSpringProducts() {
 document.querySelectorAll<HTMLElement>('[data-lm-fastspring-product]:not([data-initialized])').forEach(root => {
  root.dataset.initialized = 'true'
  const content: EcommerceFastspringProductStoryblok = JSON.parse(root.dataset.lmFastspringProduct!)
  const template = root.querySelector<HTMLTemplateElement>('template')!
  const target = root.querySelector<HTMLElement>('[data-fastspring-trigger]')!
  const message = root.querySelector<HTMLElement>('[data-commerce-message]')!
  const retry = root.querySelector<HTMLButtonElement>('[data-commerce-retry]')!
  const store = fastSpringStore(), de = root.dataset.locale === 'de', preview = root.dataset.preview === 'true'
  target.replaceChildren(template.content.cloneNode(true))
  const texts: { node: Node; value: string }[] = []
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) texts.push({ node: walker.currentNode, value: walker.currentNode.textContent || '' })
  const labels = [...target.querySelectorAll('[aria-label]')].map(node => ({ node, value: node.getAttribute('aria-label')! }))
  let complete = false
  const render = () => {
   const product = store.product(content.path), status = commerceStatus()
   const disabled = preview || !product || status !== 'ready' || store.busy
   const replace = (value: string) => value.replaceAll('{price}', product?.price || '…').replaceAll('{total}', product?.total || '…').replaceAll('{discount}', product?.unitDiscount || '')
   for (const { node, value } of texts) node.textContent = replace(value)
   for (const { node, value } of labels) node.setAttribute('aria-label', replace(value))
   if (!content.text_only) {
    target.setAttribute('aria-disabled', String(disabled))
    target.querySelectorAll('button').forEach(button => { button.disabled = disabled })
    if (!target.querySelector('button,a')) { target.tabIndex = disabled ? -1 : 0; target.setAttribute('role', 'button') }
   }
   retry.hidden = preview || status !== 'error'
   message.textContent = complete ? (de ? 'Kauf abgeschlossen. Die Auslieferung erfolgt über FastSpring.' : 'Checkout completed. FastSpring handles delivery.') : preview ? '' : status === 'error' ? (de ? 'Kaufen derzeit nicht möglich. Bitte erneut versuchen.' : 'Checkout unavailable. Please try again.') : status === 'loading' ? (de ? 'Wird geladen…' : 'Loading…') : !product ? (de ? 'Produkt nicht verfügbar.' : 'Product unavailable.') : ''
  }
  const checkout = () => {
   if (preview || content.text_only || commerceStatus() !== 'ready') return
   try { complete = false; store.checkout(content, root.dataset.successUrl || '') }
   catch { message.textContent = de ? 'Checkout fehlgeschlagen. Bitte erneut versuchen.' : 'Checkout failed. Please try again.' }
  }
  if (!content.text_only) {
   target.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); checkout() })
   target.addEventListener('keydown', event => { if (event.target === target && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); checkout() } })
  }
  retry.addEventListener('click', () => { void retryCommerce().catch(render) })
  const finished = () => { complete = true; render() }
  const unsubscribe = store.subscribe(render)
  document.addEventListener('lumen:commerce-state', render)
  document.addEventListener('lumen:purchase-completed', finished)
  render(); onUnmount(root, () => { unsubscribe(); document.removeEventListener('lumen:commerce-state', render); document.removeEventListener('lumen:purchase-completed', finished) })
 })
}

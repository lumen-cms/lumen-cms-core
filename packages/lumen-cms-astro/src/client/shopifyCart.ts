import { cartAmount, cartQuantity } from 'lumen-cms-shared/shopify'
import { initializeShopifyProvider } from './shopifyProvider'
import { onUnmount } from './lifecycle'

export function initializeShopifyCarts() {
 document.querySelectorAll<HTMLElement>('[data-lm-shopify-cart]:not([data-cart-initialized])').forEach(root => {
  root.dataset.cartInitialized = 'true'
  const config = JSON.parse(root.dataset.lmShopifyCart!)
  const store = initializeShopifyProvider(config)
  const dialog = root.querySelector<HTMLDialogElement>('dialog')!
  const container = root.querySelector<HTMLElement>('[data-cart-items]')!
  const checkout = root.querySelector<HTMLButtonElement>('[data-cart-checkout] button')!
  const error = root.querySelector<HTMLElement>('[data-cart-error]')!
  const floating = root.querySelector<HTMLButtonElement>('[data-cart-open]')!
  const templates = new Map([...root.querySelectorAll<HTMLTemplateElement>('[data-cart-template]')].map(template => [template.dataset.cartTemplate!, template]))
  const rows = new Map<string, HTMLElement>()
  const listeners = new AbortController()
  let pending = false, disposed = false, returnFocus: HTMLElement | null = null
  const render = () => {
   if (store.cartOpen && !dialog.open) returnFocus = document.activeElement as HTMLElement
   const quantity = cartQuantity(store.cartVariants)
   floating.hidden = !quantity || store.cartOpen
   root.querySelector<HTMLElement>('[data-cart-count]')!.textContent = quantity > 99 ? '99+' : String(quantity)
   checkout.disabled = pending || quantity < 1
   root.querySelector<HTMLElement>('[data-cart-total] > *')!.textContent = `${config.currency_prefix || ''} ${cartAmount(store.cartVariants)}`
   const ids = new Set(store.cartVariants.map(item => item.variant.id))
   for (const [id, row] of rows) if (!ids.has(id)) { row.remove(); rows.delete(id) }
   for (const item of store.cartVariants) {
    let row = rows.get(item.variant.id)
    if (!row) {
     const template = templates.get(item.variant.id)
     if (!template) continue
     row = template.content.firstElementChild!.cloneNode(true) as HTMLElement
     rows.set(item.variant.id, row); container.append(row)
    }
    row.querySelector<HTMLInputElement>('[data-cart-quantity]')!.value = String(item.quantity)
    row.querySelector<HTMLElement>('[data-cart-item-price]')!.textContent = `${config.currency_prefix || ''} ${(Math.round(item.quantity * Number(item.variant.priceV2.amount) * 100) / 100).toFixed(2)}`
   }
   if (store.cartOpen && !dialog.open) dialog.showModal()
   else if (!store.cartOpen && dialog.open) { dialog.close(); error.hidden = true }
  }
  const close = () => store.setCartOpen(false)
  dialog.addEventListener('cancel', event => { event.preventDefault(); close() }, { signal: listeners.signal })
  dialog.addEventListener('close', () => { if (store.cartOpen) close(); error.hidden = true; if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }) }, { signal: listeners.signal })
  dialog.addEventListener('click', event => {
   if (event.target !== dialog) return
   const rect = dialog.getBoundingClientRect()
   if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
  }, { signal: listeners.signal })
  root.addEventListener('input', event => {
   const target = event.target as HTMLInputElement
   if (!target.matches('[data-cart-quantity]')) return
   const item = store.cartVariants.find(item => item.variant.id === target.closest<HTMLElement>('[data-cart-item]')?.dataset.cartItem)
   if (item) store.updateQuantity(item.variant, Number(target.value))
  }, { signal: listeners.signal })
  root.addEventListener('click', async event => {
   const target = event.target instanceof Element ? event.target : undefined
   if (target?.closest('[data-cart-open]')) { store.setCartOpen(true); return }
   if (target?.closest('[data-cart-close]')) { close(); return }
   const control = target?.closest('[data-cart-increase],[data-cart-decrease]')
   if (control) {
    const item = store.cartVariants.find(item => item.variant.id === control.closest<HTMLElement>('[data-cart-item]')?.dataset.cartItem)
    if (item) store.updateQuantity(item.variant, item.quantity + (control.hasAttribute('data-cart-increase') ? 1 : -1))
    return
   }
   if (!target?.closest('[data-cart-checkout] button') || pending || checkout.disabled) return
   pending = true; error.hidden = true; render()
   try { await store.checkout() } catch { if (!disposed && dialog.open) error.hidden = false }
   finally { pending = false; if (!disposed) render() }
  }, { signal: listeners.signal })
  window.addEventListener('popstate', close, { signal: listeners.signal })
  const unsubscribe = store.subscribe(render)
  render()
  onUnmount(root, () => { disposed = true; listeners.abort(); unsubscribe(); dialog.close(); store.setCartOpen(false) })
 })
}

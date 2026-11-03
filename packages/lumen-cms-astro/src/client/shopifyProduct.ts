import { nativeCarousel } from './nativeCarousel'
import type { ShopifyVariant } from 'lumen-cms-shared/shopify'
import type { EcommerceShopifyConfigStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import { initializeShopifyProvider } from './shopifyProvider'
import { onUnmount } from './lifecycle'

export function initializeShopifyProducts() {
 document.querySelectorAll<HTMLElement>('[data-lm-shopify-product]:not([data-shopify-initialized])').forEach(root => {
  let payload: { variants: ShopifyVariant[]; config?: EcommerceShopifyConfigStoryblok; autoplay: boolean }
  try {
   const parsed: unknown = JSON.parse(root.dataset.lmShopifyProduct || 'null')
   if (!parsed || typeof parsed !== 'object' || !('variants' in parsed) || !Array.isArray(parsed.variants)) return
   payload = parsed as typeof payload
  } catch { return }
  const { variants, config, autoplay } = payload
  root.dataset.shopifyInitialized = 'true'
  const store = initializeShopifyProvider(config || { component: 'ecommerce_shopify_config', _uid: '' })
  const listeners = new AbortController()
  let disposed = false, pending = false, syncing = false
  const carousel = nativeCarousel(root, root.querySelector<HTMLElement>('[data-shopify-carousel]')!, {
   loop: variants.length > 1, autoplay: autoplay ? 3000 : undefined, pauseOnHover: true,
   onChange(index) { const variant = variants[index]; if (!syncing && variant && store.selectedVariant?.id !== variant.id) store.select(variant) }
  })
  const render = () => {
   const selected = store.selectedVariant
   if (!selected) return
   const index = Math.max(0, variants.findIndex(variant => variant.id === selected.id))
   if (carousel.index !== index) { syncing = true; carousel.go(index); requestAnimationFrame(() => { syncing = false }) }
   const prefix = config?.currency_prefix || ''
   root.querySelector<HTMLElement>('[data-shopify-price]')!.textContent = `${prefix} ${selected.priceV2.amount}`
   const compare = root.querySelector<HTMLElement>('[data-shopify-compare]')!
   compare.hidden = !selected.compareAtPriceV2
   compare.textContent = `${prefix} ${selected.compareAtPriceV2?.amount || ''}`
   const name = root.querySelector<HTMLElement>('[data-shopify-option-name] > *')
   if (name) name.textContent = selected.selectedOptions?.[0]?.name || ''
   root.querySelectorAll<HTMLElement>('[data-shopify-variant]').forEach(option => {
    const active = variants[Number(option.dataset.shopifyVariant)]?.id === selected.id
    const focused = option.contains(document.activeElement)
    option.querySelectorAll<HTMLElement>('[data-shopify-option-state]').forEach(state => { state.hidden = (state.dataset.shopifyOptionState === 'true') !== active; state.querySelector('button')?.setAttribute('aria-pressed', String(active)) })
    if (focused) option.querySelector<HTMLButtonElement>('[data-shopify-option-state]:not([hidden]) button')?.focus({ preventScroll: true })
   })
   root.querySelectorAll<HTMLElement>('[data-shopify-slide]').forEach(button => button.setAttribute('aria-current', String(Number(button.dataset.shopifySlide) === index)))
   const previous = root.querySelector<HTMLButtonElement>('[data-shopify-prev]'), next = root.querySelector<HTMLButtonElement>('[data-shopify-next]')
   if (previous) previous.disabled = variants.length <= 1
   if (next) next.disabled = variants.length <= 1
  }
  root.addEventListener('click', async event => {
   const target = event.target instanceof Element ? event.target : undefined
   const option = target?.closest<HTMLElement>('[data-shopify-variant]')
   if (option) { event.preventDefault(); store.select(variants[Number(option.dataset.shopifyVariant)]); return }
   const slide = target?.closest<HTMLElement>('[data-shopify-slide]')
   if (slide) { carousel.go(Number(slide.dataset.shopifySlide)); return }
   if (target?.closest('[data-shopify-prev]')) { carousel.previous(); return }
   if (target?.closest('[data-shopify-next]')) { carousel.next(); return }
   if (target?.closest('[data-shopify-add]')) { event.preventDefault(); store.addToCart(); return }
   if (!target?.closest('[data-shopify-checkout] button') || pending) return
   event.preventDefault(); pending = true
   const button = root.querySelector<HTMLButtonElement>('[data-shopify-checkout] button')!
   const error = root.querySelector<HTMLElement>('[data-shopify-error]')!
   button.disabled = true; error.hidden = true
   try { await store.checkout() } catch { if (!disposed) error.hidden = false }
   finally { pending = false; if (!disposed) button.disabled = false }
  }, { signal: listeners.signal })
  const unsubscribe = store.subscribe(render)
  if (variants[0]) store.select(variants[0])
  onUnmount(root, () => { disposed = true; listeners.abort(); unsubscribe(); carousel.destroy(); delete root.dataset.shopifyInitialized })
 })
}

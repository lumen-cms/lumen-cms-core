import type { FastSpringData, FastSpringProduct, FastSpringWebhookReceivedData } from 'lumen-cms-shared/core/components/ecommerce/fastspring/fastSpringTypes'
import type { EcommerceFastspringProductStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'

export interface CommerceUser { sub?: string; email?: string; id?: string }
export interface FastSpringRuntime {
 completion?: 'legacy-refresh' | 'redirect'
 completed?(): void
 builder: { push(data: { products: { path?: string; quantity: number }[]; tags: Record<string, string> }): unknown; checkout(): unknown }
 navigate(path: string, refresh: boolean): void | Promise<void>
 analytics?(provider: 'gtag' | 'fbq' | 'adroll', event: string, data: Record<string, unknown>): void
}

/** One provider instance owns prices, currency, pending redirect and current user. */
export function createFastSpringStore(runtime: FastSpringRuntime) {
 let products: FastSpringProduct[] = [], currency = '', redirect = '', user: CommerceUser | undefined
 let busy = false
 const purchases = new Set<string>()
 const track: NonNullable<FastSpringRuntime['analytics']> = (...args) => { try { runtime.analytics?.(...args) } catch { /* Tracking cannot interrupt checkout. */ } }
 const listeners = new Set<() => void>()
 const publish = () => listeners.forEach(listener => listener())
 const product = (path?: string) => products.find(item => item.path === path)
 return {
  get products() { return products },
  get busy() { return busy },
  get currency() { return currency },
  get redirect() { return redirect },
  product,
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
  setUser(value: CommerceUser | undefined) { user = value },
  receive(data: FastSpringData) { products = (data.groups || []).flatMap(group => group.items || []); currency = data.currency; publish() },
  checkout(content: EcommerceFastspringProductStoryblok, resolvedRedirect?: string) {
   const current = product(content.path)
   if (!current || content.text_only || busy) return
   const destination = content.on_successful_redirect
   const story = destination?.linktype === 'story' ? destination.story : undefined
   const cached = destination?.cached_url ? (story && 'url' in story && story.url) || destination.cached_url : null
   redirect = resolvedRedirect ?? (cached ? `/${cached}` : '')
   busy = true; publish()
   try {
   track('gtag', 'begin_checkout', { items: [content.path], value: current.priceValue, content_type: 'product', currency })
   track('fbq', 'InitiateCheckout', { content_ids: [content.path], value: current.priceValue, content_type: 'product', currency })
   runtime.builder.push({ products: [{ path: content.path, quantity: 1 }], tags: { sub: user?.sub ?? '', email: user?.email ?? '', id: user?.id ?? '' } })
   runtime.builder.checkout()
   } catch (error) { busy = false; redirect = ''; publish(); throw error }
  },
  purchase(data: FastSpringWebhookReceivedData | null) {
   if (!data || typeof data.total !== 'number' || !Number.isFinite(data.total) || !Array.isArray(data.items)) return
   if (data.reference && purchases.has(data.reference)) return
   if (data.reference) purchases.add(data.reference)
   track('fbq', 'Purchase', { content_ids: data.items.map(item => item.product), currency, content_type: 'product', value: data.total })
   track('adroll', 'purchase', { order_id: data.reference, products: data.items.map(item => ({ product_id: item.product, quantity: item.quantity })), conversion_value: data.total, currency })
  },
  async closed(data: { id?: string; reference?: string } | null) {
   try {
   if (data?.id && data.reference) {
    if (user && runtime.completion !== 'redirect') await runtime.navigate('/refetch', true)
    else if (redirect) await runtime.navigate(redirect, false)
    else runtime.completed?.()
   }
   } finally { redirect = ''; busy = false; publish() }
  }
 }
}

export function resolveFastSpringTrigger<T extends object>(trigger: T, product: FastSpringProduct): T {
 const result = { ...trigger } as T & Record<string, unknown>
 for (const key of ['label', 'text', 'text_xs'] as const) {
  const value = result[key]
  if (typeof value === 'string') Object.assign(result, { [key]: value.replaceAll('{price}', product.price || '').replaceAll('{total}', product.total || '').replaceAll('{discount}', product.unitDiscount || '') })
 }
 return result
}

import { expect, it, vi } from 'vitest'
import { createFastSpringStore, resolveFastSpringTrigger } from '../../packages/lumen-cms-shared/src/fastspring'
import type { FastSpringData, FastSpringProduct } from '../../src/components/ecommerce/fastspring/fastSpringTypes'
const item = { path: 'course', price: '$12', total: '$10', unitDiscount: '$2', priceValue: 12 } as FastSpringProduct
function fixture() {
 const runtime = { builder: { push: vi.fn(), checkout: vi.fn() }, navigate: vi.fn(), analytics: vi.fn() }
 const store = createFastSpringStore(runtime)
 store.receive({ currency: 'USD', groups: [{ items: [item] }] } as FastSpringData)
 return { runtime, store }
}
it('resolves repeated price placeholders without mutating CMS input', () => {
 const trigger = { label: '{price}/{price}', text: '{total}', text_xs: '{discount}' }
 expect(resolveFastSpringTrigger(trigger, item)).toEqual({ label: '$12/$12', text: '$10', text_xs: '$2' })
 expect(trigger.label).toBe('{price}/{price}')
})
it('preserves checkout payload and analytics while keeping user tags current', () => {
 const { store, runtime } = fixture()
 store.setUser({ sub: 'subject', email: 'fixture@example.test', id: 'user' })
 store.checkout({ component: 'ecommerce_fastspring_product', _uid: 'test', path: 'course' })
 expect(runtime.builder.push).toHaveBeenCalledWith({ products: [{ path: 'course', quantity: 1 }], tags: { sub: 'subject', email: 'fixture@example.test', id: 'user' } })
 expect(runtime.builder.checkout).toHaveBeenCalledTimes(1)
 expect(runtime.analytics).toHaveBeenCalledWith('gtag', 'begin_checkout', { items: ['course'], value: 12, content_type: 'product', currency: 'USD' })
})
it('does not start checkout for absent products or text-only triggers', () => {
 const { store, runtime } = fixture()
 store.checkout({ component: 'ecommerce_fastspring_product', _uid: 'a', path: 'missing' })
 store.checkout({ component: 'ecommerce_fastspring_product', _uid: 'b', path: 'course', text_only: true })
 expect(runtime.builder.checkout).not.toHaveBeenCalled()
})
it('refreshes authenticated users only after completed checkout', async () => {
 const { store, runtime } = fixture()
 store.setUser({ id: 'fixture' })
 await store.closed(null)
 expect(runtime.navigate).not.toHaveBeenCalled()
 await store.closed({ id: 'order', reference: 'reference' })
 expect(runtime.navigate).toHaveBeenCalledWith('/refetch', true)
})
it('clears redirects on cancellation and follows completed guest redirects', async () => {
 const { store, runtime } = fixture()
 const content = { component: 'ecommerce_fastspring_product' as const, _uid: 'a', path: 'course', on_successful_redirect: { linktype: 'url' as const, cached_url: 'thanks', url: 'thanks', fieldtype: 'multilink' as const, id: '' } }
 store.checkout(content)
 await store.closed(null)
 expect(store.redirect).toBe('')
 expect(runtime.navigate).not.toHaveBeenCalled()
 store.checkout(content)
 await store.closed({ id: 'order', reference: 'reference' })
 expect(runtime.navigate).toHaveBeenCalledWith('/thanks', false)
 expect(store.redirect).toBe('')
})
it('reads every product group and blocks double checkout until cancellation', async () => {
 const { store, runtime } = fixture()
 store.receive({ currency: 'EUR', groups: [{ items: [] }, { items: [item] }] } as FastSpringData)
 const content = { component: 'ecommerce_fastspring_product' as const, _uid: 'x', path: 'course' }
 store.checkout(content); store.checkout(content)
 expect(runtime.builder.checkout).toHaveBeenCalledTimes(1)
 await store.closed(null); store.checkout(content)
 expect(runtime.builder.checkout).toHaveBeenCalledTimes(2)
})
it('redirect strategy treats signed-in customers like guests and never refreshes auth', async () => {
 const navigate = vi.fn(), completed = vi.fn()
 const store = createFastSpringStore({ completion: 'redirect', navigate, completed, builder: { push() {}, checkout() {} } })
 store.setUser({ sub: 'user' }); store.receive({ currency: 'EUR', groups: [{ items: [item] }] } as FastSpringData)
 store.checkout({ component: 'ecommerce_fastspring_product', _uid: 'x', path: 'course' }, '/de/thanks')
 await store.closed({ id: 'id', reference: 'ref' })
 expect(navigate).toHaveBeenCalledWith('/de/thanks', false)
 expect(store.busy).toBe(false)
 await store.closed(null); expect(completed).not.toHaveBeenCalled()
})
it('deduplicates zero-value purchases and isolates tracking exceptions', () => {
 const analytics = vi.fn((..._args: unknown[]) => { throw new Error('blocked tracker') }), checkout = vi.fn()
 const store = createFastSpringStore({ navigate() {}, analytics, builder: { push() {}, checkout } })
 store.receive({ currency: 'USD', groups: [{ items: [item] }] } as FastSpringData)
 store.checkout({ component: 'ecommerce_fastspring_product', _uid: 'x', path: 'course' })
 expect(checkout).toHaveBeenCalledOnce()
 const order = { reference: 'order', total: 0, items: [] } as Parameters<typeof store.purchase>[0]
 store.purchase(order); store.purchase(order)
 expect(analytics.mock.calls.filter(call => call[1] === 'Purchase')).toHaveLength(1)
})
it('unlocks a failed SDK checkout and clears its redirect', () => {
 const { store, runtime } = fixture()
 runtime.builder.checkout.mockImplementationOnce(() => { throw new Error('offline') })
 expect(() => store.checkout({ component: 'ecommerce_fastspring_product', _uid: 'x', path: 'course' }, '/thanks')).toThrow('offline')
 expect(store.busy).toBe(false); expect(store.redirect).toBe('')
})

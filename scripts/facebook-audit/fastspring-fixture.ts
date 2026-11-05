import { createFastSpringStore } from '../../packages/lumen-cms-shared/src/fastspring'
// Exercise the real analytics handlers without creating an order or opening a checkout.
const store = createFastSpringStore({
 builder: { push() {}, checkout() {} },
 navigate() {},
 analytics(provider, event, data) { if (provider === 'fbq') window.fbq('track', event, data) }
})
store.receive({ currency: 'EUR', groups: [{ items: [{ path: 'audit-course', priceValue: 12.34 }] }] } as Parameters<typeof store.receive>[0])
document.getElementById('fastspring-start')!.onclick = () => store.checkout({ component: 'ecommerce_fastspring_product', _uid: 'audit', path: 'audit-course' })
document.getElementById('fastspring-complete')!.onclick = () => store.purchase({ reference: 'audit-order', total: 12.34, items: [{ product: 'audit-course', quantity: 1 }] } as Parameters<typeof store.purchase>[0])

import { LmComponentRender } from '../../CoreComponents'
import { useFastspringContext } from './context/FastSpringContext'
import { FastSpringCheckoutProps } from './fastSpringTypes'
import { useShallow } from 'zustand/react/shallow'
import { useUserData } from '../../auth/useAuth'

export default function LmFastSpringCheckout({
  content,
  trigger
}: FastSpringCheckoutProps) {
  const { products, setRedirect, currency } = useFastspringContext(
    useShallow((state) => ({
      products: state.products,
      setRedirect: state.setRedirect,
      currency: state.currency
    }))
  )
  const user = useUserData()
  const { path } = content

  const currentItem = products?.find((i) => i.path === path)

  if (!currentItem) {
    if (typeof window !== 'undefined') {
      console.log('Fastspring product item not found found', path, products)
    }
    return null
  }

  const resolvedTrigger = { ...trigger }
  for (const key of ['label', 'text', 'text_xs'] as const) {
    const value = resolvedTrigger[key]
    if (typeof value === 'string') {
      resolvedTrigger[key] = value
        .replaceAll('{price}', currentItem.price || '')
        .replaceAll('{total}', currentItem.total || '')
        .replaceAll('{discount}', currentItem.unitDiscount || '')
    }
  }
  return currentItem ? (
    <LmComponentRender
      content={resolvedTrigger}
      onClick={() => {
        if (content.text_only) {
          return
        }

        const redirect = content.on_successful_redirect
        const story =
          redirect?.linktype === 'story' ? redirect.story : undefined
        const cachedUrl = redirect?.cached_url
          ? (story && 'url' in story && story.url) || redirect.cached_url
          : null

        setRedirect(cachedUrl ? `/${cachedUrl}` : '')

        window.gtag &&
          gtag('event', 'begin_checkout', {
            items: [path],
            value: currentItem.priceValue,
            content_type: 'product',
            currency
          })

        window.fbq &&
          fbq('track', 'InitiateCheckout', {
            content_ids: [path as string],
            value: currentItem.priceValue,
            content_type: 'product',
            currency
          } as facebook.Pixel.InitiateCheckoutParameters)

        window.fastspring.builder.push({
          // reset: true,
          products: [
            {
              path,
              quantity: 1
            }
          ],
          tags: {
            sub: user?.sub ?? '',
            email: user?.email ?? '',
            id: user?.id ?? ''
          }
        })
        console.log('begin checkout', user)
        window.fastspring.builder.checkout()
      }}
    />
  ) : (
    <div>Ebook not found</div>
  )
}

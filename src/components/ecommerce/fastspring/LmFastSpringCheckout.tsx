import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { useAppContext } from '@context/AppContext'
import { useFastspringContext } from './context/FastSpringContext'
import { FastSpringCheckoutProps } from './fastSpringTypes'
import shallow from 'zustand/shallow'

export default function LmFastSpringCheckout({
  content,
  trigger
}: FastSpringCheckoutProps) {
  const { products, setRedirect, currency } = useFastspringContext(
    (state) => ({
      products: state.products,
      setRedirect: state.setRedirect,
      currency: state.currency
    }),
    shallow
  )
  const ctx = useAppContext()
  const { path } = content

  const currentItem = products?.find((i) => i.path === path)

  if (!currentItem) {
    if (typeof window !== 'undefined') {
      console.log('Fastspring product item not found found', path, products)
    }
    return null
  }

  const findStringAndReplace = (key: string) => {
    trigger[key] = trigger[key].replace('{price}', currentItem?.price || '')
    trigger[key] = trigger[key].replace('{total}', currentItem?.total || '')
    trigger[key] = trigger[key].replace(
      '{discount}',
      currentItem?.unitDiscount || ''
    )
  }
  if (trigger.label) {
    findStringAndReplace('label')
  }
  if (trigger.text) {
    findStringAndReplace('text')
  }
  if (trigger.text_xs) {
    findStringAndReplace('text_xs')
  }
  return currentItem ? (
    <LmComponentRender
      content={trigger}
      onClick={() => {
        if (content.text_only) {
          return
        }

        const cachedUrl = content.on_successful_redirect?.cached_url
          ? content.on_successful_redirect.story?.url ||
            content.on_successful_redirect.cached_url
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
            sub: ctx?.user?.sub ?? '',
            email: ctx?.user?.email ?? '',
            id: ctx?.user?.id ?? ''
          }
        })
        window.fastspring.builder.checkout()
      }}
    />
  ) : (
    <div>Ebook not found</div>
  )
}

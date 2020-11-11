import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { useAppContext } from '@context/AppContext'
import { useFastspringContext } from './context/FastSpringContext'
import { FastSpringCheckoutProps } from './fastSpringTypes'

export default function LmFastSpringCheckout({
  content,
  trigger
}: FastSpringCheckoutProps) {
  const { products, setRedirect, currency } = useFastspringContext()
  const ctx = useAppContext()
  const { path } = content

  const currentItem = products?.find((i) => i.path === path)

  if (!products.length) {
    if (typeof window !== 'undefined') {
      console.log(products)
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
            currency
          })

        window.fbq &&
          fbq('track', 'InitiateCheckout', {
            content_ids: [path as string],
            value: currentItem.priceValue,
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

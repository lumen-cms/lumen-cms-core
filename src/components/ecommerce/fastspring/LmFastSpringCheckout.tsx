import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { useFastspringContext } from './context/FastSpringContext'
import { FastSpringCheckoutProps } from './fastSpringTypes'
import { hasFacebookPixel, hasGtag } from '../../../utils/analyticsHelper'

export default function LmFastSpringCheckout({
  content,
  trigger
}: FastSpringCheckoutProps) {
  const { products } = useFastspringContext()

  const { path } = content

  const currentItem = products?.find((i) => i.path === path)

  if (!products.length) {
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
        if (hasGtag()) {
          gtag('event', 'begin_checkout', {
            items: [path],
            value: currentItem.price
          })
        }
        if (hasFacebookPixel()) {
          fbq('track', 'InitiateCheckout', {
            content_ids: [path as string],
            value: currentItem.price
          })
        }
        window.fastspring.builder.push({
          reset: true,
          products: [
            {
              path,
              quantity: 1
            }
          ]
        })
        window.fastspring.builder.checkout()
      }}
    />
  ) : (
    <div>Ebook not found</div>
  )
}

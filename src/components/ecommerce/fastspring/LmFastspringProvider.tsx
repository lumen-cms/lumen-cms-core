// eslint-disable-next-line import/no-extraneous-dependencies
import React, { FC, useState } from 'react'
import useScript from '@charlietango/use-script'
import Router from 'next/router'
import { useAppContext } from '@context/AppContext'
import { FastSpringContext } from './context/FastSpringContext'
import { useSettings } from '../../provider/SettingsPageProvider'

export const LmFastSpringProvider: FC = ({ children }) => {
  const settings = useSettings()
  const appCtx = useAppContext()
  const [currency, setCurrency] = useState('USD')
  const fastSpring = settings.ecommerce?.find(
    (i) => i.component === 'ecommerce_fastspring_config'
  )
  const [ready, status] = useScript(fastSpring?.url, {
    attributes: {
      id: 'fsc-api',
      type: 'text/javascript',
      'data-storefront': fastSpring?.data_storefront || '',
      'data-access-key': fastSpring?.data_accesss_key || '',
      'data-data-callback': 'fscDataCallback',
      'data-continuous': 'true',
      'data-popup-closed': 'fscDataPopupClosed',
      'data-popup-webhook-received': 'fscDataPopupWebhookReceived'
    }
  })
  const [products, setProducts] = useState<any[]>([])
  const [redirect, setRedirect] = useState<string>('')

  if (status === 'error') {
    console.error(status)
  }
  if (typeof window !== 'undefined' && ready) {
    window.fscDataCallback = (data) => {
      if (!products.length) {
        const fetchedProducts: any[] = data.groups[0].items
        setProducts(fetchedProducts)
        setCurrency(data.currency)
      }
    }
    window.fscDataPopupWebhookReceived = (data) => {
      // successful purchase GA should be set via GTM or inside of Fastspring itself
      if (data && data.total && Array.isArray(data.items)) {
        window.fbq &&
          fbq('track', 'Purchase', {
            content_ids: data.items.map((product) => product.product),
            currency,
            content_type: 'product',
            value: data.total
          })

        window.adroll?.track('purchase', {
          order_id: data.reference,
          products: data.items.map((pr) => ({
            product_id: pr.product,
            quantity: pr.quantity
          })),
          conversion_value: data.total,
          currency
        })
      } else {
        console.info(data) // remove soon
      }
    }
    window.fscDataPopupClosed = async (data) => {
      if (data?.id && data?.reference) {
        // update elastic if defined
        if (appCtx?.user) {
          window.location.href = '/refetch'
          setRedirect('')
        } else if (redirect) {
          await Router.push(redirect)
          setRedirect('')
        }
      } else {
        setRedirect('')
      }
    }
  }

  return (
    <FastSpringContext.Provider value={{ products, setRedirect, currency }}>
      {children}
    </FastSpringContext.Provider>
  )
}
export default LmFastSpringProvider

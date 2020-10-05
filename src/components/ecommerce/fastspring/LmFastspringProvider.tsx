// eslint-disable-next-line import/no-extraneous-dependencies
import React, { FC, useState } from 'react'
import useScript from '@charlietango/use-script'
import { FastSpringContext } from './context/FastSpringContext'
import { EcommerceFastspringConfigStoryblok } from '../../../typings/generated/components-schema'
import { hasFacebookPixel, hasGtag } from '../../../utils/analyticsHelper'

declare global {
  interface Window {
    fastspring: any
    fscDataCallback: (data: any) => void
    dataPopupClosed: (data: { id?: string; reference?: string } | null) => void
  }
}

let cachedProducts: any[] = []

export const LmFastSpringProvider: FC<{
  fastSpring: EcommerceFastspringConfigStoryblok
}> = ({ children, fastSpring }) => {
  const [ready, status] = useScript(fastSpring?.url, {
    attributes: {
      id: 'fsc-api',
      type: 'text/javascript',
      'data-storefront': fastSpring?.data_storefront || '',
      'data-access-key': fastSpring?.data_accesss_key || '',
      'data-data-callback': 'fscDataCallback',
      'data-continuous': 'true',
      'data-popup-closed': 'dataPopupClosed'
    }
  })
  const [products, setProducts] = useState<any[]>(cachedProducts)

  if (status === 'error') {
    console.error(status)
  }
  if (typeof window !== 'undefined' && ready) {
    window.fscDataCallback = (data) => {
      if (!products.length) {
        const fetchedProducts: any[] = data.groups[0].items
        setProducts(fetchedProducts)
        cachedProducts = [...fetchedProducts]
      }
    }
    window.dataPopupClosed = (data) => {
      if (data?.id && data?.reference) {
        // successful purchase
        if (hasGtag()) {
          gtag('event', 'purchase', {
            content_id: data?.id
          })
        }
        if (hasFacebookPixel()) {
          fbq('track', 'Purchase', {
            content_ids: [data.id]
          })
        }
      }
    }
  }

  return (
    <FastSpringContext.Provider value={{ products }}>
      {children}
    </FastSpringContext.Provider>
  )
}
export default LmFastSpringProvider

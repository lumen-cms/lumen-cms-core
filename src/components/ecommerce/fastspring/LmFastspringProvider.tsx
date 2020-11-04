// eslint-disable-next-line import/no-extraneous-dependencies
import React, { FC, useState } from 'react'
import useScript from '@charlietango/use-script'
import { useRouter } from 'next/router'
import { CONFIG } from '@CONFIG'
import { FastSpringContext } from './context/FastSpringContext'
import {
  EcommerceFastspringConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'
import { hasFacebookPixel, hasGtag } from '../../../utils/analyticsHelper'

let cachedProducts: any[] = []

export const LmFastSpringProvider: FC<{
  settings: GlobalStoryblok
}> = ({ children, settings }) => {
  const router = useRouter()
  const fastSpring: EcommerceFastspringConfigStoryblok | undefined = (
    settings.ecommerce || []
  ).find((i) => i.component === 'ecommerce_fastspring_config')
  const [ready, status] = useScript(fastSpring?.url, {
    attributes: {
      id: 'fsc-api',
      type: 'text/javascript',
      'data-storefront': fastSpring?.data_storefront || '',
      'data-access-key': fastSpring?.data_accesss_key || '',
      'data-data-callback': 'fscDataCallback',
      'data-continuous': 'true',
      'data-popup-closed': 'fscDataPopupClosed'
    }
  })
  const [products, setProducts] = useState<any[]>(cachedProducts)
  const [redirect, setRedirect] = useState<string>('')

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
    if (!window.fscDataPopupClosed) {
      window.fscDataPopupClosed = async (data) => {
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

          if (process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE) {
            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE}?orderId=${data.id}`
              )
            } catch (e) {
              console.error(e)
            }
          }
          // update elastic if defined
          if (process.env.NEXT_PUBLIC_UPDATE_ELASTIC_EMAIL) {
            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_UPDATE_ELASTIC_EMAIL}?orderId=${data.id}`
              )
            } catch (e) {
              console.error(e)
            }
          }
          if (process.env.NEXT_PUBLIC_AUTH_API_ASSIGN_ROLE) {
            window.location.href = '/refetch'
          } else if (redirect) {
            await router.push(CONFIG.href, redirect)
            setRedirect('')
          }
        } else {
          setRedirect('')
        }
      }
    }
  }

  return (
    <FastSpringContext.Provider value={{ products, setRedirect }}>
      {children}
    </FastSpringContext.Provider>
  )
}
export default LmFastSpringProvider

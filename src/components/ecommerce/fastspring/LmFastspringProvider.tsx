// eslint-disable-next-line import/no-extraneous-dependencies
import React, { FC, useState } from 'react'
import useScript from '@charlietango/use-script'
import { useRouter } from 'next/router'
import { CONFIG } from '@CONFIG'
import { useAppContext } from '@context/AppContext'
import { FastSpringContext } from './context/FastSpringContext'
import {
  EcommerceFastspringConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'

let cachedProducts: any[] = []

export const LmFastSpringProvider: FC<{
  settings: GlobalStoryblok
}> = ({ children, settings }) => {
  const router = useRouter()
  const appCtx = useAppContext()
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
    window.fscDataPopupClosed = async (data) => {
      if (data?.id && data?.reference) {
        // successful purchase GA should be set via GTM or inside of Fastspring itself

        window.fbq &&
          fbq('track', 'Purchase', {
            content_ids: [data.id]
          })

        // update elastic if defined
        if (appCtx?.user) {
          window.location.href = '/refetch'
          setRedirect('')
        } else if (redirect) {
          await router.push(CONFIG.href, redirect)
          setRedirect('')
        }
      } else {
        setRedirect('')
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

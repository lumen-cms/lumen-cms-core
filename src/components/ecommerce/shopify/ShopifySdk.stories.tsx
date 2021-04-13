import { LmCoreComponents } from '@CONFIG'
import { LmComponentRender } from '@LmComponentRender'
import { useEffect, useState } from 'react'
import { appContext } from '../../../storybook/config'
import {
  ButtonStoryblok,
  EcommerceCheckoutStoryblok,
  EcommerceShopifyCheckoutStoryblok,
  EcommerceShopifyConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'
import { LmShopifySdkProvider } from './ShopifySdkProvider'
import { LmAppContainer } from '../../layout/AppContainer'
import LmShopifyProduct from './ShopifyProduct'
import { getShopifyPageProps } from './lib/getShopifyPageProps'
// import { LmEcommerceCheckout } from '../src'
// import { LmShopifyProduct } from '../src/components/shopify/ShopifyProduct'
// import { LmShopifySdkProvider } from '../src/components/ecommerce/shopify_old/ShopifySdkProvider'

LmCoreComponents.lm_app_providers.push(LmShopifySdkProvider)
// LmCoreComponents.ecommerce_checkout = LmEcommerceCheckout
LmCoreComponents.ecommerce_shopify_checkout = LmShopifyProduct

// const sdk = 'http://sdks.shopifycdn.com/js-buy-sdk/v2/latest/index.umd.min.js'
const ACCESS_TOKEN = '9e9a0888f96c95dc362ef9712e10b584'
const DOMAIN = 'kembalisales.myshopify.com'

export default {
  title: 'Ecommerce/Shopify',
  decorators: [
    (Story: any) => {
      appContext.content.settings = {
        ...appContext.content.settings,
        ecommerce: [
          {
            _uid: '23',
            component: 'ecommerce_shopify_config',
            // sdk_url: sdk,
            domain: DOMAIN,
            access_token: ACCESS_TOKEN,
            currency_prefix: '€',
            image_container_height: 250,
            product_active_variant: [
              {
                _uid: '123123121',
                component: 'button',
                color: 'primary'
              } as ButtonStoryblok
            ]
          } as EcommerceShopifyConfigStoryblok
        ]
      } as GlobalStoryblok

      const [items, setItems] = useState({})
      useEffect(() => {
        const fetch = async () => {
          const x = { page: {} }
          await getShopifyPageProps(x as any)
          setItems(x)
        }
        fetch()
      }, [])

      return (
        <LmAppContainer
          content={{
            ...items,
            ...appContext.content
          }}
        >
          <Story />
        </LmAppContainer>
      )
    }
  ]
}

export const Luzide = () => {
  return (
    <div>
      <LmComponentRender
        content={
          {
            _uid: '123',
            component: 'ecommerce_checkout',
            integration: [
              {
                _uid: 'gjhkghjkhfgjh',
                component: 'ecommerce_shopify_checkout',
                handle: 'lucid-dream-eye-mask-45185'
              } as EcommerceShopifyCheckoutStoryblok
            ] as any
          } as EcommerceCheckoutStoryblok
        }
      />
    </div>
  )
}

export const Cake = () => {
  return (
    <div>
      <LmComponentRender
        content={
          {
            _uid: '123',
            component: 'ecommerce_checkout',
            integration: [
              {
                _uid: 'gjhkghjkhfgjh',
                component: 'ecommerce_shopify_checkout',
                handle: 'surprise-cake-stand-1-tier-81761'
              } as EcommerceShopifyCheckoutStoryblok
            ] as any
          } as EcommerceCheckoutStoryblok
        }
      />
    </div>
  )
}

export const CakeAlternative = () => {
  return (
    <div>
      <LmComponentRender
        content={
          {
            _uid: '123',
            component: 'ecommerce_checkout',
            integration: [
              {
                _uid: 'gjhkghjkhfgjh',
                component: 'ecommerce_shopify_checkout',
                handle: 'surprise-cake-stand-19372'
              } as EcommerceShopifyCheckoutStoryblok
            ] as any
          } as EcommerceCheckoutStoryblok
        }
      />
    </div>
  )
}

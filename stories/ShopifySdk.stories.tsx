import { appContext } from './config'
import {
  EcommerceCheckoutStoryblok,
  EcommerceShopifyCheckoutStoryblok,
  EcommerceShopifyConfigStoryblok,
  GlobalStoryblok
} from '../src/typings/generated/components-schema'
import { LmAppContainer, LmComponentRender, LmCoreComponents } from '../src/'
import * as React from 'react'
// import { LmEcommerceCheckout } from '../src'
// import { LmShopifyProduct } from '../src/components/shopify/ShopifyProduct'
import { LmShopifySdkProvider } from '../src/components/ecommerce/shopify/ShopifySdkProvider'

LmCoreComponents.lm_app_providers.push(LmShopifySdkProvider)
// LmCoreComponents.ecommerce_checkout = LmEcommerceCheckout
// LmCoreComponents.ecommerce_shopify_checkout = LmShopifyProduct

// const sdk = 'http://sdks.shopifycdn.com/js-buy-sdk/v2/latest/index.umd.min.js'
const ACCESS_TOKEN = '9e9a0888f96c95dc362ef9712e10b584'
const DOMAIN = 'kembalisales.myshopify.com'

export default {
  title: 'Shopify SDK',
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
            currency_prefix: 'EUR',
            image_container_height: 250
          } as EcommerceShopifyConfigStoryblok
        ]
      } as GlobalStoryblok
      return (
        <LmAppContainer content={appContext.content}>
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
            ]
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
            ]
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
            ]
          } as EcommerceCheckoutStoryblok
        }
      />
    </div>
  )
}

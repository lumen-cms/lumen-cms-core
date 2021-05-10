import { LmCoreComponents } from '@CONFIG'
import { LmComponentRender } from '@LmComponentRender'
import { FC, useEffect, useMemo, useState } from 'react'
import {
  ButtonStoryblok,
  EcommerceCheckoutStoryblok,
  EcommerceShopifyCheckoutStoryblok,
  EcommerceShopifyConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'
import { LmShopifySdkProvider } from './ShopifySdkProvider'
import LmShopifyProduct from './ShopifyProduct'
import { getShopifyPageProps } from './lib/getShopifyPageProps'
import CoreDecorator from '../../../storybook/components/CoreDecorator'
import getBasicSettings from '../../../storybook/components/basicSettings'
import './ShopifyComponents'

const ACCESS_TOKEN = '9e9a0888f96c95dc362ef9712e10b584'
const DOMAIN = 'kembalisales.myshopify.com'

const ShopifyStoryContainer: FC<{
  domain?: string
  accessToken?: string
}> = ({ children, domain, accessToken }) => {
  const settings = useMemo(
    () =>
      ({
        ...getBasicSettings(),
        ecommerce: [
          {
            _uid: '23',
            component: 'ecommerce_shopify_config',
            // sdk_url: sdk,
            domain: domain || DOMAIN,
            access_token: accessToken || ACCESS_TOKEN,
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
      } as GlobalStoryblok),
    []
  )

  const [items, setItems] = useState({})
  useEffect(() => {
    const fetch = async () => {
      const x = { page: {}, settings }
      await getShopifyPageProps(x as any)
      setItems(x)
    }
    fetch()
  }, [settings])
  return (
    <CoreDecorator settings={settings} {...items}>
      {children}
    </CoreDecorator>
  )
}
export default {
  title: 'Ecommerce/Shopify'
}

export const Luzide = () => {
  return (
    <ShopifyStoryContainer>
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
    </ShopifyStoryContainer>
  )
}

export const Cake = () => {
  return (
    <ShopifyStoryContainer>
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
    </ShopifyStoryContainer>
  )
}

export const CakeAlternative = () => {
  return (
    <ShopifyStoryContainer>
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
    </ShopifyStoryContainer>
  )
}

export const BaliShivaEye = () => {
  return (
    <ShopifyStoryContainer
      domain="shimmy-creations.myshopify.com"
      accessToken="88efcb67ee87736026853608d38041f4"
    >
      <LmComponentRender
        content={
          {
            _uid: '123',
            component: 'ecommerce_checkout',
            integration: [
              {
                _uid: 'gjhkghjkhfgjh',
                component: 'ecommerce_shopify_checkout',
                handle: 'bali-shiva-eye-necklace'
              } as EcommerceShopifyCheckoutStoryblok
            ] as any
          } as EcommerceCheckoutStoryblok
        }
      />
    </ShopifyStoryContainer>
  )
}

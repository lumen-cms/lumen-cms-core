import { LmComponentRender } from '@LmComponentRender'
import { Story } from '@storybook/react'
import { FC, PropsWithChildren } from 'react'
import {
  ButtonStoryblok,
  EcommerceCheckoutStoryblok,
  EcommerceShopifyCheckoutStoryblok,
  EcommerceShopifyConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'
import { getShopifyPageProps } from './lib/getShopifyPageProps'
import CoreDecorator from '../../../storybook/components/CoreDecorator'
import getBasicSettings from '../../../storybook/components/basicSettings'
import './ShopifyComponents'

const ACCESS_TOKEN = '9e9a0888f96c95dc362ef9712e10b584'
const DOMAIN = 'kembalisales.myshopify.com'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Ecommerce/Shopify'
}

const getShopifySettings = (context?: {
  domain?: string
  accessToken?: string
}): Partial<GlobalStoryblok> => {
  const settings: Partial<GlobalStoryblok> = {
    ...getBasicSettings(),
    ecommerce: [
      {
        _uid: '23',
        component: 'ecommerce_shopify_config',
        // sdk_url: sdk,
        domain: context?.domain || DOMAIN,
        access_token: context?.accessToken || ACCESS_TOKEN,
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
  }
  return settings
}

const ShopifyStoryContainer: FC<
  PropsWithChildren<{
    pageProps: any
    settings: GlobalStoryblok
  }>
> = ({ children, settings, pageProps }) => {
  return (
    <CoreDecorator settings={settings} {...pageProps}>
      {children}
    </CoreDecorator>
  )
}

const Template: Story<{
  handle: string
}> = ({ handle }, { loaded: { data, settings } }) => {
  return (
    <ShopifyStoryContainer settings={settings} pageProps={data}>
      <LmComponentRender
        content={
          {
            _uid: '123',
            component: 'ecommerce_checkout',
            integration: [
              {
                _uid: 'gjhkghjkhfgjh',
                component: 'ecommerce_shopify_checkout',
                handle
              } as EcommerceShopifyCheckoutStoryblok
            ] as any
          } as EcommerceCheckoutStoryblok
        }
      />
    </ShopifyStoryContainer>
  )
}

export const LuzideNew = Template.bind({})
LuzideNew.args = {
  handle: 'lucid-dream-eye-mask-45185'
}
// eslint-disable-next-line
// @ts-ignore
LuzideNew.loaders = [
  async () => {
    const settings = getShopifySettings()
    const data = { page: {}, settings }
    await getShopifyPageProps(data as any)
    return { data, settings }
  }
]

export const Cake = Template.bind({})
Cake.args = {
  handle: 'surprise-cake-stand-1-tier-81761'
}
// eslint-disable-next-line
// @ts-ignore
Cake.loaders = [
  async () => {
    const settings = getShopifySettings()
    const data = { page: {}, settings }
    await getShopifyPageProps(data as any)
    return { data, settings }
  }
]

export const CakeAlternative = Template.bind({})
CakeAlternative.args = {
  handle: 'surprise-cake-stand-19372'
}
// eslint-disable-next-line
// @ts-ignore
CakeAlternative.loaders = [
  async () => {
    const settings = getShopifySettings()
    const data = { page: {}, settings }
    await getShopifyPageProps(data as any)
    return { data, settings }
  }
]

export const BaliShivaEye = Template.bind({})
BaliShivaEye.args = {
  handle: 'bali-shiva-eye-necklace'
}
// eslint-disable-next-line
// @ts-ignore
BaliShivaEye.loaders = [
  async () => {
    const settings = getShopifySettings({
      domain: 'shimmy-creations.myshopify.com',
      accessToken: '88efcb67ee87736026853608d38041f4'
    })
    const data = { page: {}, settings }
    await getShopifyPageProps(data as any)
    return { data, settings }
  }
]

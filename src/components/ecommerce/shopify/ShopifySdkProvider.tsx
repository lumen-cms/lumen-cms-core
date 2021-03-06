import React, { FC, useEffect, useRef, useState } from 'react'
import {
  ShopifyProductFragment,
  ShopifySdkContext
} from './context/ShopifySdkContext'
import { ShopfiyCart } from './product/ShopifyCart'
import { ShopifyFloatingCart } from './product/ShopifyFloatingCart'
import { EcommerceShopifyConfigStoryblok } from '../../../typings/generated/components-schema'
import { getTotalCartAmount } from './lib/shopifyHelpers'
import { shopifyGraphqlSdk } from './lib/shopify-graphql-request'
import { CheckoutCreateInput } from '../../../typings/generated/shopify-schema'
import { useSettings } from '../../provider/SettingsPageProvider'

let currencyCode = 'EUR'
export const LmShopifySdkProvider: FC = ({ children }) => {
  const settings = useSettings()
  const shopifyConfig: EcommerceShopifyConfigStoryblok | undefined = (
    settings.ecommerce || []
  ).find(
    (i) => i.component === 'ecommerce_shopify_config'
  ) as EcommerceShopifyConfigStoryblok
  const checkoutLinkRef = useRef<HTMLAnchorElement | null>(null)
  const [selectedVariant, setSelectedVariant] =
    useState<ShopifyProductFragment>()
  const [cartVariants, setCartVariants] = useState<
    {
      quantity: number
      variant: ShopifyProductFragment
    }[]
  >([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!cartOpen) {
      setCartVariants((items) => items.filter((i) => i.quantity > 0))
    }
  }, [cartOpen, setCartVariants])

  const initCheckout = async (input: CheckoutCreateInput) => {
    const { checkoutCreate } = await shopifyGraphqlSdk({
      domain: shopifyConfig?.domain,
      accessToken: shopifyConfig?.access_token
    }).checkoutCreate({ input })

    return checkoutCreate?.checkout
  }

  const onVariantSelect = async (variant: ShopifyProductFragment) => {
    window.gtag &&
      gtag('event', 'select_content', {
        items: [variant.id]
      })

    window.fbq &&
      fbq('track', 'CustomizeProduct', {
        content_ids: [variant.id as string],
        content_type: 'product'
      })

    setSelectedVariant(variant)
    currencyCode = variant.priceV2.currencyCode
  }

  const addToCart = () => {
    if (!selectedVariant?.id) {
      return // always one should be selected
    }

    const newItem = {
      variant: selectedVariant,
      quantity: 1
    }
    const items = [...cartVariants]
    if (!items.find((i) => i.variant.id === selectedVariant.id)) {
      items.push(newItem)
    }

    const totalPrice = getTotalCartAmount(items)
    window.fbq &&
      fbq('track', 'AddToCart', {
        content_ids: items?.map((i) => `${i.variant.id}`),
        value: totalPrice,
        content_type: 'product',
        currency: currencyCode
      })
    window.gtag &&
      gtag('event', 'add_to_cart', {
        items: items?.map((i) => ({
          id: i.variant.id,
          quantity: i.quantity
        })),
        content_type: 'product',
        value: totalPrice,
        currency: currencyCode
      })

    setCartVariants(items)
    setCartOpen(true)
  }

  const onCheckout = async () => {
    let lineItems = cartVariants.map((i) => ({
      quantity: i.quantity,
      variantId: i.variant.id
    }))
    let totalPrice = getTotalCartAmount(cartVariants)
    if (!lineItems.length && selectedVariant?.id) {
      lineItems = [
        {
          quantity: 1,
          variantId: selectedVariant?.id
        }
      ]
      totalPrice = getTotalCartAmount([
        { quantity: 1, variant: selectedVariant }
      ])
    }
    if (!lineItems.length) {
      return
    }
    const c = await initCheckout({
      allowPartialAddresses: true,
      lineItems
    })

    window.gtag &&
      gtag('event', 'begin_checkout', {
        items: lineItems.map((i) => ({
          id: i.variantId,
          quantity: i.quantity
        })),
        value: totalPrice,
        content_type: 'product',
        currency: currencyCode
      })

    window.fbq &&
      fbq('track', 'InitiateCheckout', {
        content_ids: lineItems.map((i) => `${i.variantId}`),
        value: totalPrice,
        content_type: 'product',
        currency: currencyCode
      })

    const webUrl = c?.webUrl
    const anchor = checkoutLinkRef.current
    if (anchor !== null) {
      anchor.href = webUrl
      anchor.click()
    }
    return webUrl
  }

  const updateCartItemQuantity = (
    variant: ShopifyProductFragment,
    quantity: number
  ) => {
    const items = cartVariants.map((i) => {
      return {
        variant: i.variant,
        quantity:
          i.variant.id === variant.id
            ? quantity < 0
              ? 0
              : quantity
            : i.quantity
      }
    })
    setCartVariants(items)

    const totalPrice = getTotalCartAmount(cartVariants)

    window.fbq &&
      fbq('track', 'AddToCart', {
        content_ids: items.map((i) => `${i.variant.id}`),
        value: totalPrice,
        content_type: 'product',
        currency: currencyCode
      })

    window.gtag &&
      gtag('event', 'add_to_cart', {
        items: items.map((i) => ({
          id: i.variant.id,
          quantity: i.quantity
        })),
        content_type: 'product',
        currency: currencyCode,
        value: totalPrice
      })
  }
  return (
    <ShopifySdkContext.Provider
      value={{
        onVariantSelect,
        selectedVariant,
        onCheckout,
        cartOpen,
        setCartOpen,
        cartVariants,
        addToCart,
        updateCartItemQuantity,
        config: shopifyConfig as EcommerceShopifyConfigStoryblok
      }}
    >
      {children}
      <a
        href="/#"
        ref={checkoutLinkRef}
        aria-label="checkout link"
        style={{ display: 'none' }}
      >
        checkout
      </a>
      <ShopfiyCart />
      <ShopifyFloatingCart />
    </ShopifySdkContext.Provider>
  )
}
LmShopifySdkProvider.displayName = 'LmShopifySdkProvider'

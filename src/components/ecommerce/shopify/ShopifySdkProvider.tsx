import React, { FC, useEffect, useState } from 'react'
import Client, { Cart, LineItem, Product, ProductVariant } from 'shopify-buy'
import {
  EcommerceShopifyConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'
import { ShopifySdkContext } from './context/ShopifySdkContext'
import { ShopfiyCart } from './product/ShopifyCart'
import { ShopifyFloatingCart } from './product/ShopifyFloatingCart'
import { hasFacebookPixel, hasGtag } from '../../../utils/analyticsHelper'

let client: Client.Client
let checkout: Cart
export const LmShopifySdkProvider: FC<{ settings: GlobalStoryblok }> = ({
  children,
  settings
}) => {
  const shopifyConfig: EcommerceShopifyConfigStoryblok | undefined = (
    settings.ecommerce || []
  ).find((i) => i.component === 'ecommerce_shopify_config')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>()
  const [cartVariants, setCartVariants] = useState<LineItem[]>([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [totalAmount, setTotalAmount] = useState<number>(0)

  useEffect(() => {
    const startFetch = async () => {
      if (!shopifyConfig?.domain || !shopifyConfig?.access_token) {
        return
      }
      client = Client.buildClient({
        domain: shopifyConfig.domain,
        storefrontAccessToken: shopifyConfig.access_token,
        language: 'de-DE'
      })

      const c = await client.checkout.create()
      checkout = c

      const items = await client.product.fetchAll()
      // Do something with the products
      setProducts(items)
    }

    startFetch()
  }, [shopifyConfig?.access_token, shopifyConfig?.domain])
  const onVariantSelect = (variant: ProductVariant) => {
    if (hasGtag()) {
      gtag('event', 'select_content', {
        items: [variant.id]
      })
    }
    if (hasFacebookPixel()) {
      fbq('track', 'CustomizeProduct', {
        content_ids: [variant.id as string]
      })
    }

    setSelectedVariant(variant)
  }

  const openCheckoutWindow = (url: string) => {
    const a = window.document.createElement('a')
    a.target = '_blank'
    a.href = url
    a.click()
    a.remove()
  }

  const addToCart = () => {
    if (!selectedVariant?.id) {
      return // always one should be selected
    }
    const newLineItems = [
      {
        variantId: selectedVariant?.id,
        quantity: 1
      }
    ]

    client.checkout.addLineItems(checkout.id, newLineItems).then((c) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const totalPrice = Number(c.paymentDue)

      if (hasFacebookPixel()) {
        fbq('track', 'AddToCart', {
          content_ids: c.lineItems.map((i) => `${i.variantId}`),
          value: totalPrice
        })
      }
      if (hasGtag()) {
        gtag('event', 'add_to_cart', {
          items: c.lineItems.map((i) => ({
            id: i.variantId,
            quantity: i.quantity
          })),
          value: totalPrice
        })
      }
      setCartVariants(c.lineItems)
      setCartOpen(true)
      setTotalAmount(totalPrice)
    })
  }

  const onCheckout = async () => {
    let c = null
    if (cartVariants.length) {
      c = await client.checkout.fetch(checkout.id as any)
    } else {
      if (!selectedVariant?.id) {
        return // always one should be selected
      }
      const newLineItems = [
        {
          variantId: selectedVariant?.id,
          quantity: 1
        }
      ]
      c = await client.checkout.addLineItems(checkout.id, newLineItems)
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const totalPrice = Number(c.paymentDue)
    if (hasGtag()) {
      gtag('event', 'begin_checkout', {
        items: c.lineItems.map((i) => ({
          id: i.variantId,
          quantity: i.quantity
        })),
        value: totalPrice
      })
    }
    if (hasFacebookPixel()) {
      fbq('track', 'InitiateCheckout', {
        content_ids: c.lineItems.map((i) => `${i.variantId}`),
        value: totalPrice
      })
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    openCheckoutWindow(c.webUrl)
    setTotalAmount(totalPrice)
  }

  const updateCartItemQuantity = (variant: LineItem, quantity: number) => {
    client.checkout
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .updateLineItems(checkout.id, [
        {
          id: variant.id,
          quantity
        }
      ])
      .then((c: Cart) => {
        setCartVariants(c.lineItems)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const totalPrice = Number(c.paymentDue)
        setTotalAmount(totalPrice)
        if (hasFacebookPixel()) {
          fbq('track', 'AddToCart', {
            content_ids: c.lineItems.map((i) => `${i.variantId}`),
            value: totalPrice
          })
        }
        if (hasGtag()) {
          gtag('event', 'add_to_cart', {
            items: c.lineItems.map((i) => ({
              id: i.variantId,
              quantity: i.quantity
            })),
            value: totalPrice
          })
        }
      })
  }
  return (
    <ShopifySdkContext.Provider
      value={{
        products,
        onVariantSelect,
        selectedVariant,
        onCheckout,
        cartOpen,
        setCartOpen,
        cartVariants,
        addToCart,
        updateCartItemQuantity,
        totalAmount,
        config: shopifyConfig as EcommerceShopifyConfigStoryblok
      }}
    >
      {children}
      <ShopfiyCart />
      <ShopifyFloatingCart />
    </ShopifySdkContext.Provider>
  )
}
LmShopifySdkProvider.displayName = 'LmShopifySdkProvider'

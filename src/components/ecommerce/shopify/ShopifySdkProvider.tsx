import React, { FC, useEffect, useRef, useState } from 'react'
import Client, { Cart, LineItem, Product, ProductVariant } from 'shopify-buy'
import {
  EcommerceShopifyConfigStoryblok,
  GlobalStoryblok
} from '../../../typings/generated/components-schema'
import { ShopifySdkContext } from './context/ShopifySdkContext'
import { ShopfiyCart } from './product/ShopifyCart'
import { ShopifyFloatingCart } from './product/ShopifyFloatingCart'

let client: Client.Client
let checkout: Cart
export const LmShopifySdkProvider: FC<{ settings: GlobalStoryblok }> = ({
  children,
  settings
}) => {
  const shopifyConfig: EcommerceShopifyConfigStoryblok | undefined = (
    settings.ecommerce || []
  ).find((i) => i.component === 'ecommerce_shopify_config')
  const checkoutLinkRef = useRef<HTMLAnchorElement | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>()
  const [cartVariants, setCartVariants] = useState<LineItem[]>([])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [checkoutUrl, setCheckoutUrl] = useState<string>('')

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
      setCheckoutUrl(c.webUrl)
    }

    startFetch()
  }, [shopifyConfig?.access_token, shopifyConfig?.domain])
  const onVariantSelect = async (variant: ProductVariant) => {
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
  }

  const addToCart = async () => {
    if (!selectedVariant?.id) {
      return // always one should be selected
    }
    const newLineItems = [
      {
        variantId: selectedVariant?.id,
        quantity: 1
      }
    ]
    const c = await client.checkout.addLineItems(checkout.id, newLineItems)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const totalPrice = Number(c.paymentDue)

    window.fbq &&
      fbq('track', 'AddToCart', {
        content_ids: c.lineItems.map((i) => `${i.variantId}`),
        value: totalPrice,
        content_type: 'product',
        currency: c.currencyCode
      })

    window.gtag &&
      gtag('event', 'add_to_cart', {
        items: c.lineItems.map((i) => ({
          id: i.variantId,
          quantity: i.quantity
        })),
        value: totalPrice,
        currency: c.currencyCode
      })

    setCartVariants(c.lineItems)
    setCartOpen(true)
    setTotalAmount(totalPrice)
  }

  const onCheckout = async () => {
    setCheckoutUrl('')
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
    window.gtag &&
      gtag('event', 'begin_checkout', {
        items: c.lineItems.map((i) => ({
          id: i.variantId,
          quantity: i.quantity
        })),
        value: totalPrice,
        currency: c.currencyCode
      })

    window.fbq &&
      fbq('track', 'InitiateCheckout', {
        content_ids: c.lineItems.map((i) => `${i.variantId}`),
        value: totalPrice,
        content_type: 'product',
        currency: c.currencyCode
      })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTotalAmount(totalPrice)
    setCheckoutUrl(c.webUrl)
    const anchor = checkoutLinkRef.current
    if (anchor !== null) {
      anchor.href = c.webUrl
      anchor.click()
    }
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
        window.fbq &&
          fbq('track', 'AddToCart', {
            content_ids: c.lineItems.map((i) => `${i.variantId}`),
            value: totalPrice,
            content_type: 'product'
          })

        window.gtag &&
          gtag('event', 'add_to_cart', {
            items: c.lineItems.map((i) => ({
              id: i.variantId,
              quantity: i.quantity
            })),
            value: totalPrice
          })
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
        checkoutUrl,
        config: shopifyConfig as EcommerceShopifyConfigStoryblok
      }}
    >
      {children}
      <a
        href="#"
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

import {
  ButtonStoryblok,
  EcommerceFastspringProductStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  ImageStoryblok
} from '../../../typings/generated/components-schema'

export type FastSpringCheckoutProps = {
  content: EcommerceFastspringProductStoryblok
  trigger: ButtonStoryblok | ImageStoryblok | IconStoryblok | HeadlineStoryblok // need to keep up to date
}

export type FastSpringData = {
  currency: string
  country: string
  language: string
  taxExemptionAllowed: string
  taxExempt: boolean
  total: string
  totalValue: number
  groups: { items: FastSpringProduct[] }[]
  [k: string]: any
}

export type FastSpringProduct = {
  path: string
  pid: string
  selected: boolean
  quantity: 1
  price: string
  priceValue: number
  priceTotal: string
  priceTotalValue: number
  unitPrice: string
  unitPriceValue: number
  unitDiscountValue: number
  discountTotal: string
  discountTotalValue: number
  total: string
  totalValue: number
  [k: string]: any
}

export type FastSpringWebhookReceivedData = {
  id: string
  reference: string
  currency: string
  payoutCurrency: string
  total: number
  totalDisplay: string
  totalInPayoutCurrency: number
  totalInPayoutCurrencyDisplay: string
  items: {
    product: string
    quantity: number
    coupon: string
    sku: string
    [k: string]: any
  }[]
  [k: string]: any
}

declare global {
  interface Window {
    fastspring: any
    fscDataCallback: (data: FastSpringData) => void
    fscDataPopupClosed: (
      data: { id?: string; reference?: string } | null
    ) => void
    fscDataPopupWebhookReceived: (data: FastSpringWebhookReceivedData) => void
  }
}

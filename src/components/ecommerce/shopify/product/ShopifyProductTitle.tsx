import { LmComponentRender } from '../../../CoreComponents'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { useShopifySdkContext } from '../context/ShopifySdkContext'

export function ShopifyProductTitle({ item }: ShopifyProductItemProps) {
  const { config } = useShopifySdkContext()

  return (
    <LmComponentRender
      content={{
        component: 'headline',
        _uid: '123',
        align: 'center',
        typography: 'headline4',
        ...((config?.product_title && config.product_title[0]) || {}),
        text: item.title
      }}
    />
  )
}

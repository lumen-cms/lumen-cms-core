import Grid from '@material-ui/core/Grid'
import React, { ReactNode } from 'react'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { EcommerceShopifyConfigStoryblok } from '../../../../typings/generated/components-schema'

type ShopifyProductContainerProps = {
  LeftColumn: ReactNode
  RightColumn: ReactNode
}

const mapWidth = (
  value:
    | EcommerceShopifyConfigStoryblok['columns_second_width']
    | EcommerceShopifyConfigStoryblok['columns_first_width']
): boolean | 'auto' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 => {
  switch (value) {
    case 'true':
      return true
    case 'auto':
      return 'auto'
    default:
      return Number(value) as 1
  }
}

export function ShopifyProductContainer({
  LeftColumn,
  RightColumn
}: ShopifyProductContainerProps) {
  const { config } = useShopifySdkContext()
  return (
    <Grid
      direction="row"
      container
      justify={config?.columns_justify || 'center'}
      alignItems={config?.columns_align_items || 'center'}
    >
      <Grid
        item
        xs={12}
        sm={
          config?.columns_first_width
            ? mapWidth(config?.columns_first_width)
            : 6
        }
      >
        {LeftColumn}
      </Grid>
      <Grid
        item
        xs={12}
        sm={
          config?.columns_second_width
            ? mapWidth(config?.columns_second_width)
            : 6
        }
      >
        {RightColumn}
      </Grid>
    </Grid>
  )
}

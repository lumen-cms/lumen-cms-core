import React from 'react'
import { Grid, useTheme } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import RemoveIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Image from 'next/image'
import {
  ShopifySdkContextProps,
  useShopifySdkContext
} from '../context/ShopifySdkContext'
import {
  EcommerceShopifyConfigStoryblok,
  HeadlineStoryblok
} from '../../../../typings/generated/components-schema'
import { imageSizesOnWidthAndBreakpoints } from '../../../../utils/ImageService'

type ShopifyCartVariantItemProps = {
  lineItem: ShopifySdkContextProps['cartVariants'][0]
  config: EcommerceShopifyConfigStoryblok
}

export function ShopifyCartVariantItem({
  lineItem,
  config
}: ShopifyCartVariantItemProps) {
  const { updateCartItemQuantity } = useShopifySdkContext()
  const { breakpoints } = useTheme()
  const { title, priceV2, image, productTitle } = lineItem.variant
  const titleCustom = (Array.isArray(config?.product_title) &&
    config.product_title[0]) as HeadlineStoryblok
  const overwrittenTitle = titleCustom?.text || ''
  return (
    <Grid container spacing={2}>
      <Grid item>
        <Avatar>
          <Image
            src={image?.transformedSrc}
            layout="fill"
            objectFit="cover"
            sizes={imageSizesOnWidthAndBreakpoints(40, breakpoints)}
            alt={title}
          />
        </Avatar>
      </Grid>
      <Grid item xs>
        <div>{overwrittenTitle || productTitle}</div>
        <div>{title}</div>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              updateCartItemQuantity(lineItem.variant, lineItem.quantity - 1)
            }}
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            type="number"
            size="small"
            variant="standard"
            value={lineItem.quantity}
            onChange={(ev) => {
              updateCartItemQuantity(lineItem.variant, Number(ev.target.value))
            }}
            style={{
              width: 70
            }}
            inputProps={{
              style: {
                textAlign: 'center'
              }
            }}
          />
          <IconButton
            size="small"
            onClick={() => {
              updateCartItemQuantity(lineItem.variant, lineItem.quantity + 1)
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <Grid item style={{ alignSelf: 'flex-end' }}>
        <Typography variant="subtitle1">
          {config?.currency_prefix || ''}{' '}
          {(
            Math.round(lineItem.quantity * Number(priceV2.amount) * 100) / 100
          ).toFixed(2)}
        </Typography>
      </Grid>
    </Grid>
  )
}

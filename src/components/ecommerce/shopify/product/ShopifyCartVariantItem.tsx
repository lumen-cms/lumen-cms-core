import { LineItem, ProductVariant } from 'shopify-buy'
import React from 'react'
import { Grid } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import RemoveIcon from '@material-ui/icons/Remove'
import AddIcon from '@material-ui/icons/Add'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { EcommerceShopifyConfigStoryblok } from '../../../../typings/generated/components-schema'

type ShopifyCartVariantItemProps = {
  lineItem: LineItem & { variant: ProductVariant }
  config: EcommerceShopifyConfigStoryblok
}

export function ShopifyCartVariantItem({
  lineItem,
  config
}: ShopifyCartVariantItemProps) {
  const { updateCartItemQuantity } = useShopifySdkContext()

  const { title, quantity, variant } = lineItem
  return (
    <Grid container spacing={2}>
      <Grid item>
        <Avatar src={variant.image.src} alt={variant.title} />
      </Grid>
      <Grid item xs>
        <div>{title}</div>
        <div>{variant.title}</div>
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
              updateCartItemQuantity(lineItem, quantity - 1)
            }}
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            type="number"
            size="small"
            variant="standard"
            value={quantity}
            onChange={(ev) => {
              updateCartItemQuantity(lineItem, Number(ev.target.value))
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
              updateCartItemQuantity(lineItem, quantity + 1)
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
      <Grid item style={{ alignSelf: 'flex-end' }}>
        <Typography variant="subtitle1">
          {config?.currency_prefix || ''}{' '}
          {(Math.round(quantity * Number(variant.price) * 100) / 100).toFixed(
            2
          )}
        </Typography>
      </Grid>
    </Grid>
  )
}

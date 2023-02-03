import React, { useState } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import Drawer from '@mui/material/Drawer'
import { Theme, Toolbar } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Divider from '@mui/material/Divider'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { ShopifyCartVariantItem } from './ShopifyCartVariantItem'
import {
  ButtonStoryblok,
  HeadlineStoryblok
} from '../../../../typings/generated/components-schema'
import { getTotalCartAmount, getTotalCartQuantity } from '../lib/shopifyHelpers'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
  cartItemContent: {
    padding: theme.spacing(3),
    overflowY: 'auto'
  },
  cartActions: {
    padding: theme.spacing(3)
  },
  cartCheckoutButton: {
    marginTop: theme.spacing(2)
  },
  cartVariantDivider: {
    marginTop: theme.spacing(1)
  },
  cartFooterHeadline: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  }
}))

function CheckoutButton() {
  const { onCheckout, config, cartVariants } = useShopifySdkContext()
  const { classes } = useStyles()
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <div className={classes.cartCheckoutButton}>
      <LmComponentRender
        content={
          {
            component: 'button',
            label: 'Checkout',
            _uid: '1321',
            variant: 'raised',
            color: 'primary',
            class_names: { values: ['w-100'] },
            ...((config?.cart_checkout && config.cart_checkout[0]) || {})
          } as ButtonStoryblok
        }
        disabled={loading || getTotalCartQuantity(cartVariants) < 1}
        onClick={async () => {
          setLoading(true)
          await onCheckout()
          setLoading(false)
        }}
      />
    </div>
  )
}

export function ShopfiyCart() {
  const { cartOpen, setCartOpen, cartVariants, config } = useShopifySdkContext()
  const { classes, theme } = useStyles()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  const footer: HeadlineStoryblok = {
    component: 'headline',
    text: 'Estimated Costs',
    _uid: 'asde',
    typography: 'headline5',
    ...((config?.cart_footer && config.cart_footer[0]) || {})
  }

  const totalAmount = getTotalCartAmount(cartVariants)
  return (
    <Drawer
      open={cartOpen}
      anchor="right"
      variant="temporary"
      PaperProps={{
        style: {
          width: isMobile ? '100%' : 400
        }
      }}
      onClose={() => {
        setCartOpen(false)
      }}
    >
      <Grid container direction="column" style={{ flex: 1 }}>
        <Grid>
          <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
            <LmComponentRender
              content={
                {
                  component: 'headline',
                  text: 'Shopping Cart',
                  _uid: '123',
                  typography: 'headline4',
                  ...((config?.cart_toolbar && config.cart_toolbar[0]) || {})
                } as HeadlineStoryblok
              }
            />

            <IconButton
              edge="end"
              onClick={() => {
                setCartOpen(false)
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider />
        </Grid>
        <Grid xs className={classes.cartItemContent}>
          {cartVariants.map((lineItem) => (
            <div key={lineItem.variant.id}>
              <ShopifyCartVariantItem lineItem={lineItem} config={config} />
              <Divider className={classes.cartVariantDivider} />
            </div>
          ))}
        </Grid>
        <Divider />
        <Grid className={classes.cartActions}>
          <div className={classes.cartFooterHeadline}>
            <LmComponentRender content={footer} />
            <LmComponentRender
              content={{
                ...footer,
                text: `${config?.currency_prefix || ''} ${totalAmount}`
              }}
            />
          </div>
          {config?.cart_footer_additional?.map((blok: HeadlineStoryblok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
          <CheckoutButton />
        </Grid>
      </Grid>
    </Drawer>
  )
}

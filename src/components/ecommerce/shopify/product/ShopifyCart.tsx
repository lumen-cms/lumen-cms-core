import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import Drawer from '@material-ui/core/Drawer'
import { createStyles, Theme, Toolbar, useTheme } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { makeStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { ShopifyCartVariantItem } from './ShopifyCartVariantItem'
import {
  ButtonStoryblok,
  HeadlineStoryblok
} from '../../../../typings/generated/components-schema'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)

export function ShopfiyCart() {
  const {
    cartOpen,
    setCartOpen,
    cartVariants,
    totalAmount,
    onCheckout,
    config
  } = useShopifySdkContext()
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.only('xs'))

  const footer: HeadlineStoryblok = {
    component: 'headline',
    text: 'Estimated Costs',
    _uid: 'asde',
    typography: 'headline5',
    ...((config?.cart_footer && config.cart_footer[0]) || {})
  }

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
        <Grid item>
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
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider />
        </Grid>
        <Grid item xs className={classes.cartItemContent}>
          {cartVariants.map((lineItem) => (
            <div key={lineItem.id}>
              <ShopifyCartVariantItem
                lineItem={lineItem as any}
                config={config}
              />
              <Divider className={classes.cartVariantDivider} />
            </div>
          ))}
        </Grid>
        <Divider />
        <Grid item className={classes.cartActions}>
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
            <LmComponentRender content={blok} _uid={blok._uid} />
          ))}
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
              onClick={() => {
                onCheckout()
              }}
            />
          </div>
        </Grid>
      </Grid>
    </Drawer>
  )
}

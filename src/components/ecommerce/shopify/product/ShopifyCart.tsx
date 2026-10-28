import { useState } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import Drawer from '@mui/material/Drawer'
import { Toolbar } from '@mui/material'
import Grid from '../../../../vendor/grid'
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
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

function CheckoutButton() {
  const { onCheckout, config, cartVariants } = useShopifySdkContext()
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <Box sx={{ marginTop: 2 }}>
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
    </Box>
  )
}

export function ShopfiyCart() {
  const { cartOpen, setCartOpen, cartVariants, config } = useShopifySdkContext()
  const theme = useTheme()
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
      onClose={() => {
        setCartOpen(false)
      }}
      slotProps={{
        paper: {
          style: {
            width: isMobile ? '100%' : 400
          }
        }
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
        <Grid xs sx={{ padding: 3, overflowY: 'auto' }}>
          {cartVariants.map((lineItem) => (
            <div key={lineItem.variant.id}>
              <ShopifyCartVariantItem lineItem={lineItem} config={config} />
              <Divider sx={{ marginTop: 1 }} />
            </div>
          ))}
        </Grid>
        <Divider />
        <Grid sx={{ padding: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 2
            }}
          >
            <LmComponentRender content={footer} />
            <LmComponentRender
              content={{
                ...footer,
                text: `${config?.currency_prefix || ''} ${totalAmount}`
              }}
            />
          </Box>
          {config?.cart_footer_additional?.map((blok: HeadlineStoryblok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
          <CheckoutButton />
        </Grid>
      </Grid>
    </Drawer>
  )
}

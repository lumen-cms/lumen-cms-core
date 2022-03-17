import React from 'react'
import { Fab, Theme } from '@mui/material'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import makeStyles from '@mui/styles/makeStyles';
import Badge from '@mui/material/Badge'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { getTotalCartQuantity } from '../lib/shopifyHelpers'
import { EcommerceShopifyConfigStoryblok } from '../../../../typings/generated/components-schema'

type FloatingStylesProps = {
  buttonColor: EcommerceShopifyConfigStoryblok['floating_button_color']
  badgeColor: EcommerceShopifyConfigStoryblok['floating_badge_color']
}
const useStyles = makeStyles((theme: Theme) => ({
  sticky: {
    position: 'fixed',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: '24px 0 0 24px',
    minHeight: 70
  },
  buttonColor: ({ buttonColor = 'primary' }: FloatingStylesProps) => ({
    backgroundColor: theme.palette[buttonColor]?.main,
    color: theme.palette[buttonColor]?.contrastText,
    '&:hover': {
      backgroundColor: theme.palette[buttonColor]?.dark
    }
  }),
  badgeColor: ({ badgeColor = 'warning' }: FloatingStylesProps) => ({
    backgroundColor: theme.palette[badgeColor]?.main,
    color: theme.palette[badgeColor]?.contrastText
  })
}))

export function ShopifyFloatingCart() {
  const { cartVariants, cartOpen, setCartOpen, config } = useShopifySdkContext()
  const classes = useStyles({
    buttonColor: config?.floating_button_color,
    badgeColor: config?.floating_badge_color
  })

  const totalCartQuantity = getTotalCartQuantity(cartVariants)

  return totalCartQuantity && !cartOpen ? (
    <Fab
      classes={{
        root: classes.sticky,
        primary: classes.buttonColor
      }}
      color="primary"
      onClick={() => {
        setCartOpen(true)
      }}
    >
      <Badge
        badgeContent={totalCartQuantity}
        color="primary"
        classes={{
          colorPrimary: classes.badgeColor
        }}
      >
        <ShoppingCartOutlined color="inherit" />
      </Badge>
    </Fab>
  ) : null
}

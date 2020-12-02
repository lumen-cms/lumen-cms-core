import React from 'react'
import { Fab, Theme } from '@material-ui/core'
import ShoppingCartOutlined from '@material-ui/icons/ShoppingCartOutlined'
import { makeStyles } from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import { useShopifySdkContext } from '../context/ShopifySdkContext'

const useStyles = makeStyles((theme: Theme) => ({
  sticky: {
    position: 'fixed',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: '24px 0 0 24px',
    minHeight: 70
  },
  buttonColor: (props: { buttonColor: any }) => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    backgroundColor: theme.palette[props.buttonColor].main,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    color: theme.palette[props.buttonColor].contrastText,
    '&:hover': {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      backgroundColor: theme.palette[props.buttonColor].dark
    }
  }),
  badgeColor: (props: { buttonColor: string; badgeColor: string }) => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    backgroundColor: theme.palette[props.badgeColor].main,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    color: theme.palette[props.badgeColor].contrastText
  })
}))

export function ShopifyFloatingCart() {
  const { cartVariants, cartOpen, setCartOpen, config } = useShopifySdkContext()
  const classes = useStyles({
    buttonColor: config?.floating_button_color || 'primary',
    badgeColor: config?.floating_badge_color || 'warning'
  })
  const isOpen = cartVariants.length && !cartOpen

  return isOpen ? (
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
        badgeContent={cartVariants.length}
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

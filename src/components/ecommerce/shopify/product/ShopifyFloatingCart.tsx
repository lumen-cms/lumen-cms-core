import { Fab } from '@mui/material'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'
import Badge from '@mui/material/Badge'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { getTotalCartQuantity } from '../lib/shopifyHelpers'
import { EcommerceShopifyConfigStoryblok } from '../../../../typings/generated/components-schema'
import { Theme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

const fabSx =
  (buttonColor: EcommerceShopifyConfigStoryblok['floating_button_color']) =>
  (theme: Theme): SystemStyleObject<Theme> => ({
    position: 'fixed',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    borderRadius: '24px 0 0 24px',
    minHeight: 70,
    backgroundColor: theme.palette[buttonColor || 'primary']?.main,
    color: theme.palette[buttonColor || 'primary']?.contrastText,
    '&:hover': {
      backgroundColor: theme.palette[buttonColor || 'primary']?.dark
    }
  })

const badgeSx =
  (badgeColor: EcommerceShopifyConfigStoryblok['floating_badge_color']) =>
  (theme: Theme): SystemStyleObject<Theme> => ({
    backgroundColor: theme.palette[badgeColor || 'warning']?.main,
    color: theme.palette[badgeColor || 'warning']?.contrastText
  })

export function ShopifyFloatingCart() {
  const { cartVariants, cartOpen, setCartOpen, config } = useShopifySdkContext()

  const totalCartQuantity = getTotalCartQuantity(cartVariants)

  return totalCartQuantity && !cartOpen ? (
    <Fab
      sx={fabSx(config?.floating_button_color)}
      color="primary"
      onClick={() => {
        setCartOpen(true)
      }}
    >
      <Badge
        badgeContent={totalCartQuantity}
        color="primary"
        slotProps={{ badge: { sx: badgeSx(config?.floating_badge_color) } }}
      >
        <ShoppingCartOutlined color="inherit" />
      </Badge>
    </Fab>
  ) : null
}

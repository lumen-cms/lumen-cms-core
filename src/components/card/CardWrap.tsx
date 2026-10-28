import { CSSProperties, FunctionComponent, PropsWithChildren } from 'react'
import Card from '@mui/material/Card'
import { shadowEffectSx } from '../jss/shadowStyles'
import { CardListItemProps } from './cardTypes'

const CardWrap: FunctionComponent<PropsWithChildren<CardListItemProps>> = ({
  children,
  options
}) => {
  const variants = options.variant || []
  const style: CSSProperties = {
    borderRadius: options.border_radius ? options.border_radius : undefined,
    backgroundColor: options.background_color?.rgba
      ? options.background_color.rgba
      : undefined
  }

  return (
    <Card
      className="lm-card"
      sx={
        options.shadow_effect
          ? shadowEffectSx[options.shadow_effect]
          : undefined
      }
      raised={variants.includes('raised')}
      elevation={options.elevation ? Number(options.elevation) : undefined}
      style={style}
    >
      {children}
    </Card>
  )
}
CardWrap.displayName = 'CardWrap'

export default CardWrap

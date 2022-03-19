import { CSSProperties, FunctionComponent } from 'react'
import Card from '@mui/material/Card'
import clsx from 'clsx'
import useShadowStyles from '../jss/shadowStyles'
import { CardListItemProps } from './cardTypes'

const CardWrap: FunctionComponent<CardListItemProps> = ({
  children,
  options
}) => {
  const className = 'lm-card'
  const styles = useShadowStyles().classes
  const variants = options.variant || []
  const style: CSSProperties = {
    borderRadius: options.border_radius ? options.border_radius : undefined,
    backgroundColor: options.background_color?.rgba
      ? options.background_color.rgba
      : undefined
  }

  return (
    <Card
      className={clsx(className, {
        [styles[options.shadow_effect]]: !!options.shadow_effect
      })}
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

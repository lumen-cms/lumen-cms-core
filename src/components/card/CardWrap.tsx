import React, { CSSProperties, FunctionComponent } from 'react'
import CardWrapWithAction from './CardWrapWithAction'
import { CardListItemProps } from './cards'
import Card from '@material-ui/core/Card'
import ContentLink from '../link/ContentLink'
import clsx from 'clsx'
import useShadowStyles from '../jss/shadowStyles'

const CardWrap: FunctionComponent<CardListItemProps> = ({ children, content, options }) => {
  const className = 'lm-card'
  const styles = useShadowStyles()
  const variants = options.variant || []
  const style: CSSProperties = {
    borderRadius: options.border_radius ? options.border_radius : undefined
  }


  if (content.body && content.body.length) {
    return <CardWrapWithAction className={className}
                               content={content}
                               style={style}
                               options={options}>{children}</CardWrapWithAction>
  }

  return (
    <Card className={clsx(className, {
      [styles[options.shadow_effect]]: !!options.shadow_effect
    })}
          raised={variants.includes('raised')}
          elevation={options.elevation ? Number(options.elevation) : undefined}
          style={style}>
      <ContentLink content={content} className={'lm-card__link'}>
        {children}
      </ContentLink>
    </Card>
  )
}
CardWrap.displayName = 'CardWrap'

export default CardWrap

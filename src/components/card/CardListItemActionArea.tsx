import { FC } from 'react'
import { LinkHandlerProps } from '../../utils/linkHandler'
import CardActionArea from '@material-ui/core/CardActionArea'

const CardListItemActionArea: FC<{ buttonProps: LinkHandlerProps }> = ({
  children,
  buttonProps
}) => {
  return buttonProps.href || buttonProps.email ? (
    <CardActionArea {...buttonProps}>{children}</CardActionArea>
  ) : (
    <>{children}</>
  )
}

export default CardListItemActionArea

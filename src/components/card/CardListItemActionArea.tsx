import { FC, PropsWithChildren, useState } from 'react'
import { LinkHandlerProps } from '../../utils/linkHandler'
import CardActionArea from '@mui/material/CardActionArea'
import { CardListItemProps } from './cardTypes'
import CardListItemDrawer from './CardListItemDrawer'

const CardListItemActionArea: FC<
  PropsWithChildren<{
    buttonProps: LinkHandlerProps
    content: CardListItemProps['content']
  }>
> = ({ children, content, buttonProps }) => {
  const [open, setOpen] = useState<boolean>(false)
  if (content.body?.length) {
    return (
      <>
        <CardActionArea
          onClick={() => {
            setOpen(true)
          }}
        >
          {children}
        </CardActionArea>
        <CardListItemDrawer
          content={content}
          setOpen={(bool) => setOpen(bool)}
          open={open}
        />
      </>
    )
  }
  return buttonProps.href || buttonProps.email || buttonProps.onClick ? (
    <CardActionArea {...buttonProps}>{children}</CardActionArea>
  ) : (
    <>{children}</>
  )
}

export default CardListItemActionArea

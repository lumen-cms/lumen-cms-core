import Drawer from '@material-ui/core/Drawer'
import React, { CSSProperties, FunctionComponent } from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { LmComponentRender } from '../CoreComponents'
import { CardListItemProps } from './cardTypes'

interface CardWrapAction extends CardListItemProps {
  className: string
  style: CSSProperties
}

const useStyles = makeStyles((theme: Theme) => ({
  drawerContent: {
    padding: theme.spacing(3),
    minWidth: '30%'
  }
}))

const CardWrapWithAction: FunctionComponent<CardWrapAction> = ({
  content,
  className,
  style,
  children,
  options
}) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState<boolean>(false)
  const body = content.body || []
  const variants = options.variant || []

  return (
    <>
      <Card
        className={className}
        raised={variants.includes('raised')}
        elevation={options.elevation ? Number(options.elevation) : undefined}
        style={style}
      >
        {/* eslint-disable-next-line */}
        <a onClick={() => setOpen(!open)}>{children}</a>
      </Card>
      <Drawer open={open} anchor="right" onClose={() => setOpen(false)}>
        <div className={classes.drawerContent}>
          {body.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </div>
      </Drawer>
    </>
  )
}
CardWrapWithAction.displayName = 'CardWrapWithAction'

export default CardWrapWithAction

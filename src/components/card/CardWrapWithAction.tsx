import Drawer from '@material-ui/core/Drawer'
import React, { CSSProperties, FunctionComponent } from 'react'
import { CardListItemProps } from './cards'
import Card from '@material-ui/core/Card'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useAppContext } from '../provider/AppProvider'

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

const CardWrapWithAction: FunctionComponent<CardWrapAction> = ({ content, className, style, children, options }) => {
  const classes = useStyles()
  const { ComponentRender } = useAppContext()

  let [open, setOpen] = React.useState<boolean>(false)
  const body = content.body || []
  const variants = options.variant || []

  return (
    <>
      <Card className={className}
            raised={variants.includes('raised')}
            elevation={options.elevation ? Number(options.elevation) : undefined}
            style={style}>
        <a onClick={() => setOpen(!open)}>
          {children}
        </a>
      </Card>
      <Drawer open={open}
              anchor="right"
              onClose={() => setOpen(false)}>
        <div className={classes.drawerContent}>
          {body.map((blok, i) => ComponentRender({ content: blok, i }))}
        </div>
      </Drawer>
    </>
  )
}
CardWrapWithAction.displayName = 'CardWrapWithAction'

export default CardWrapWithAction

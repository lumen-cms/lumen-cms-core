import Drawer from '@material-ui/core/Drawer'
import { CSSProperties, FunctionComponent, useState } from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Close from 'mdi-material-ui/Close'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import { LmComponentRender } from '@LmComponentRender'
import { CardListItemProps } from './cardTypes'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'

type CardWrapAction = Omit<CardListItemProps, 'inView'> & {
  className: string
  style: CSSProperties
}

const useStyles = makeStyles((theme: Theme) => ({
  drawerContent: {
    padding: theme.spacing(3),
    flex: 1,
    overflowY: 'auto'
  },
  drawerToolbar: {
    justifyContent: 'space-between'
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

  const [open, setOpen] = useState<boolean>(false)
  const { isMobile } = useDeviceDimensions()
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
      <Drawer
        open={open}
        anchor="right"
        PaperProps={{
          style: {
            width: isMobile ? '100%' : content.action_width || 420
          }
        }}
        onClose={() => {
          setOpen(false)
        }}
      >
        <Grid container direction="column">
          <Grid item>
            <Toolbar classes={{ root: classes.drawerToolbar }}>
              {content.action_headline?.map((blok) => (
                <LmComponentRender content={blok} key={blok._uid} />
              )) ?? <div />}
              <IconButton
                edge="end"
                onClick={() => {
                  setOpen(false)
                }}
              >
                <Close />
              </IconButton>
            </Toolbar>
          </Grid>
          <Grid className={classes.drawerContent}>
            {content.body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Grid>
        </Grid>
      </Drawer>
    </>
  )
}
CardWrapWithAction.displayName = 'CardWrapWithAction'

export default CardWrapWithAction

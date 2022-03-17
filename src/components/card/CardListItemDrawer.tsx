import Drawer from '@mui/material/Drawer'
import { FunctionComponent } from 'react'
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Toolbar from '@mui/material/Toolbar'
import Close from 'mdi-material-ui/Close'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import { LmComponentRender } from '@LmComponentRender'
import { CardListItemProps } from './cardTypes'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'

type CardWrapAction = Pick<CardListItemProps, 'content'> & {
  setOpen: (bool: boolean) => void
  open: boolean
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

const CardListItemDrawer: FunctionComponent<CardWrapAction> = ({
  content,
  setOpen,
  open
}) => {
  const classes = useStyles()

  const { isMobile } = useDeviceDimensions()

  return (
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
              size="large">
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
  );
}
CardListItemDrawer.displayName = 'CardWrapWithAction'

export default CardListItemDrawer

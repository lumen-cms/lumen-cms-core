import Drawer from '@mui/material/Drawer'
import { FunctionComponent, PropsWithChildren } from 'react'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Close from 'mdi-material-ui/Close'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Unstable_Grid2'
import { LmComponentRender } from '@LmComponentRender'
import { CardListItemProps } from './cardTypes'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'

type CardWrapAction = Pick<CardListItemProps, 'content'> & {
  setOpen: (bool: boolean) => void
  open: boolean
}

const CardListItemDrawer: FunctionComponent<
  PropsWithChildren<CardWrapAction>
> = ({ content, setOpen, open }) => {
  const theme = useTheme()
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
        <Grid>
          <Toolbar
            sx={{
              justifyContent: 'space-between'
            }}
          >
            {content.action_headline?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            )) ?? <div />}
            <IconButton
              edge="end"
              onClick={() => {
                setOpen(false)
              }}
              size="large"
            >
              <Close />
            </IconButton>
          </Toolbar>
        </Grid>
        <Grid
          sx={{
            padding: theme.spacing(3),
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {content.body?.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </Grid>
      </Grid>
    </Drawer>
  )
}
CardListItemDrawer.displayName = 'CardWrapWithAction'

export default CardListItemDrawer

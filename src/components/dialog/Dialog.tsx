import React, { useState } from 'react'
import { DialogStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Close from 'mdi-material-ui/Close'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'

const TransitionSlideUp = React.forwardRef((props, ref) =>
  // @ts-ignore
  <Slide direction="up" ref={ref} {...props} />)


const useStyles = makeStyles({
  trigger: {
    cursor: 'pointer'
  },
  dialogTitle: {
    '& .MuiTypography-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },
  contentNoPadding: {
    padding: 0
  }
})

export type LmDialogProps = {
  content: DialogStoryblok
}

export function LmDialog({ content }: LmDialogProps): JSX.Element | null {
  const theme = useTheme()
  const classes = useStyles()
  const mediaQueryResult = useMediaQuery(theme.breakpoints.down(content.fullscreen || 'sm'))
  const fullScreen = content.fullscreen ? mediaQueryResult : false
  const { ComponentRender } = useAppContext()
  const [isOpen, setOpen] = useState<boolean>(false)
  if (!Array.isArray(content.trigger)) {
    console.warn('The Dialog has not a correct trigger element.')
  }
  const dialogProps: DialogProps = {
    open: isOpen,
    fullScreen,
    onClose: content.prevent_click_outside ? undefined : () => setOpen(false)
  }
  if (content.slide_up) {
    // @ts-ignore
    dialogProps.TransitionComponent = TransitionSlideUp
  }
  return (
    <div>
      <a onClick={() => setOpen(true)} className={classes.trigger}>
        {content.trigger?.map((blok, i) => ComponentRender({ content: blok, i }))}
      </a>
      <Dialog {...dialogProps}>
        {!!content.title || !content.prevent_close_button && (
          <DialogTitle classes={{
            root: classes.dialogTitle
          }}>
            <span>{content.title}</span>
            {!content.prevent_close_button && (
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            )}
          </DialogTitle>
        )}
        <DialogContent classes={{
          root: content.no_padding ? classes.contentNoPadding : ''
        }}>
          {content.body?.map((blok, i) => ComponentRender({ content: blok, i }))}
        </DialogContent>
      </Dialog>
    </div>
  )
}

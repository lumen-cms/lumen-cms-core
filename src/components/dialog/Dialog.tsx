import React, { useState } from 'react'
import Dialog, { DialogProps } from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import Close from 'mdi-material-ui/Close'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Slide from '@material-ui/core/Slide'
import { LmComponentRender } from '../..'
import { LmDialogProps } from './dialogTypes'

const TransitionSlideUp = React.forwardRef((props, ref) => (
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  <Slide direction="up" ref={ref} {...props} />
))

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
  }
})

export default function LmDialog({
  content
}: LmDialogProps): JSX.Element | null {
  const theme = useTheme()
  const classes = useStyles()
  const mediaQueryResult = useMediaQuery(
    theme.breakpoints.down(content.fullscreen || 'sm')
  )
  const fullScreen = content.fullscreen ? mediaQueryResult : false
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    dialogProps.TransitionComponent = TransitionSlideUp
  }
  return (
    <div>
      {/* eslint-disable-next-line */}
      <a onClick={() => setOpen(true)} className={classes.trigger}>
        {content.trigger?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </a>
      <Dialog {...dialogProps}>
        {!!content.title ||
          (!content.prevent_close_button && (
            <DialogTitle
              classes={{
                root: classes.dialogTitle
              }}
            >
              <span>{content.title}</span>
              {!content.prevent_close_button && (
                <IconButton onClick={() => setOpen(false)}>
                  <Close />
                </IconButton>
              )}
            </DialogTitle>
          ))}
        {content.no_padding ? (
          <>
            {content.body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </>
        ) : (
          <DialogContent>
            {content.body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

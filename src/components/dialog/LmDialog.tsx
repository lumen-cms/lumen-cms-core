import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import { LmComponentRender } from '@LmComponentRender'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import React from 'react'
import makeStyles from '@mui/styles/makeStyles';
import Slide from '@mui/material/Slide'
import { LmDialogAsyncProps } from './dialogTypes'
import clsx from 'clsx'

const useStyles = makeStyles({
  dialogTitle: {
    '& .MuiTypography-root': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
})

const TransitionSlideUp = React.forwardRef(function TransitionSlideUp(
  props,
  ref
) {
  return (
    // @ts-ignore
    <Slide direction="up" ref={ref} {...props} />
  )
})

export default function LmDialog({
  dialogProps,
  content,
  setOpen
}: LmDialogAsyncProps) {
  const classes = useStyles()
  if (content.slide_up) {
    // eslint-disable-next-line
    // @ts-ignore
    dialogProps.TransitionComponent = TransitionSlideUp
  }
  return (
    <Dialog {...dialogProps}>
      <DialogTitle
        className={clsx({
          'd-none': content.prevent_close_button && !content.title
        })}
        classes={{
          root: classes.dialogTitle
        }}
      >
        {!content.custom_title?.length && <span>{content.title}</span>}
        {content.custom_title?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
        {!content.prevent_close_button && (
          <IconButton onClick={() => setOpen(false)} size="large">
            <Close />
          </IconButton>
        )}
      </DialogTitle>

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
  );
}

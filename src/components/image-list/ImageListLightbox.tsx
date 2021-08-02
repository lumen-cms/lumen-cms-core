import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Close from 'mdi-material-ui/Close'
import Swipe from './ImageListLightboxSwipe'
import { ImageListLightboxProps } from './imageListTypes'
import { useImageListLightboxStyles } from './useImageListLightboxStyles'

function ImageListLightbox(props: ImageListLightboxProps): JSX.Element {
  const classes = useImageListLightboxStyles()
  return (
    <Dialog
      fullScreen
      className={classes.lightbox}
      onClose={() => {
        props.setLightbox('')
      }}
      open={!!props.lightbox}
    >
      <DialogTitle>
        <IconButton
          className="text-white"
          onClick={() => {
            props.setLightbox('')
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Swipe {...props} />
    </Dialog>
  )
}

export default ImageListLightbox

import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
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
          size="large">
          <Close />
        </IconButton>
      </DialogTitle>
      <Swipe {...props} />
    </Dialog>
  );
}

export default ImageListLightbox

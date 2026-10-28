import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import Swipe from './ImageListLightboxSwipe'
import { ImageListLightboxProps } from './imageListTypes'
import { imageListLightboxSx } from './imageListLightboxStyles'

function ImageListLightbox(props: ImageListLightboxProps): React.JSX.Element {
  return (
    <Dialog
      fullScreen
      sx={imageListLightboxSx}
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
          size="large"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <Swipe {...props} />
    </Dialog>
  )
}

export default ImageListLightbox

import { makeStyles } from 'tss-react/mui'

export const useImageListStyles = makeStyles()({
  root: {
    overflow: 'hidden',
    '&.with-lightbox .MuiImageListItem-root': {
      cursor: 'pointer'
    }
  },
  rootGrid: {
    justifyContent: 'center'
  },
  aspectRatio: {
    '& .MuiImageListItem-root .MuiImageListItem-img': {
      position: 'absolute',
      height: '100%'
    },
    '&.ratio-1x1 .MuiImageListItem-root': {
      paddingBottom: '100%'
    },
    '&.ratio-4x3 .MuiImageListItem-root': {
      paddingBottom: '75%'
    },
    '&.ratio-3x2 .MuiImageListItem-root': {
      paddingBottom: '66.66%'
    },
    '&.ratio-16x9 .MuiImageListItem-root': {
      paddingBottom: '56.25%'
    },
    '&.ratio-3x4 .MuiImageListItem-root': {
      paddingBottom: '133.33%'
    },
    '&.ratio-2x3 .MuiImageListItem-root': {
      paddingBottom: '150%'
    },
    '&.ratio-1x2 .MuiImageListItem-root': {
      paddingBottom: '200%'
    },
    '&.ratio-2x1 .MuiImageListItem-root': {
      paddingBottom: '50%'
    },
    '&.ratio-1x3 .MuiImageListItem-root': {
      paddingBottom: '300%'
    },
    '&.ratio-3x1 .MuiImageListItem-root': {
      paddingBottom: '33.33%'
    },
    '&.ratio-2.85x1 .MuiImageListItem-root': {
      paddingBottom: '35.09%'
    }
  }
})

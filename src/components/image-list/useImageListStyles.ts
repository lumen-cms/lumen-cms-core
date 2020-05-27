import { makeStyles } from '@material-ui/core/styles'

export const useImageListStyles = makeStyles({
  lightbox: {
    '& .MuiPaper-root': {
      backgroundColor: 'rgba(0,0,0,0.9)'
    },
    '& .MuiDialogTitle-root': {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 2
    },
    '& .carousel': {
      height: '100%'
    },
    '& .carousel-inner': {
      height: '100%'
    },
    '& .react-swipeable-view-container': {
      height: '100%',

      '& .carousel-item': {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
    '& .MuiSvgIcon-root': {
      color: 'white'
    },
    '& .carousel-indicators': {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      textAlign: 'center'
    },
    '& .carousel-control-next, & .carousel-control-prev': {
      position: 'absolute',
      height: '100%',
      top: 0,
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: '4rem',
        color: 'rgba(255,255,255,0.8)'
      }
    },
    '& .carousel-control-next': {
      right: 0
    }
  },
  root: {
    overflowX: 'hidden',
    '&.with-lightbox': {}
  },
  aspectRatio: {
    '& .MuiGridListTile-tile': {
      // paddingBottom: '56.25%',
      '& img': {
        position: 'absolute',
        // top: 0,
        // left: 0,
        // width: '100%',
        // height: '100%'
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    },
    '&.ratio-* .MuiGridListTile-tile':{
      '& img': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
        // top: '50%',
        // left: '50%',
        // transform: 'translate(-50%, -50%)',
      }
    },
    '&.ratio-1x1 .MuiGridListTile-tile': {
      paddingBottom: '100%'
    },
    '&.ratio-4x3 .MuiGridListTile-tile': {
      paddingBottom: '75%'
    },
    '&.ratio-3x2 .MuiGridListTile-tile': {
      paddingBottom: '66.66%'
    },
    '&.ratio-16x9 .MuiGridListTile-tile': {
      paddingBottom: '56.25%'
    },
    '&.ratio-3x4 .MuiGridListTile-tile': {
      paddingBottom: '133.33%'
    },
    '&.ratio-2x3 .MuiGridListTile-tile': {
      paddingBottom: '150%'
    }
  },
  masonry: {
    '& img': {
      display: 'block',
      width: '100%',
      height: 'auto'
    },
    '& .MuiGridList-root': {
      display: 'block'
    },
    '& .MuiGridListTile-root': {
      width: 'auto !important',
      breakInside: 'avoid-column',
      position: 'relative'
    }
  }
})

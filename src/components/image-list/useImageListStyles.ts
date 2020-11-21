import { makeStyles } from '@material-ui/core/styles'

export const useImageListStyles = makeStyles({
  root: {
    overflowX: 'hidden',
    '&.with-lightbox .MuiGridListTile-root': {
      cursor: 'pointer'
    }
  },
  rootGrid: {
    justifyContent: 'center'
  },
  // defaultImg: {
  //   '& img': {
  //     display: 'block',
  //     width: '100%',
  //     height: 'auto',
  //     marginTop: '50%',
  //     transform: 'translateY(-50%)'
  //   }
  // },
  aspectRatio: {
    '& .MuiGridListTile-tile': {
      // paddingBottom: '56.25%',
      // marginBottom: '-6px',
      // '& img': {
      //   position: 'absolute',
      //   // top: 0,
      //   // left: 0,
      //   // width: '100%',
      //   // height: '100%'
      //   top: '50%',
      //   left: '50%',
      //   transform: 'translate(-50%, -50%)'
      // }
    },
    // '&.ratio-* .MuiGridListTile-tile': {
    //   '& img': {
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     width: '100%',
    //     height: '100%'
    //     // top: '50%',
    //     // left: '50%',
    //     // transform: 'translate(-50%, -50%)',
    //   }
    // },
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
    },
    '&.ratio-1x2 .MuiGridListTile-tile': {
      paddingBottom: '200%'
    },
    '&.ratio-2x1 .MuiGridListTile-tile': {
      paddingBottom: '50%'
    },
    '&.ratio-1x3 .MuiGridListTile-tile': {
      paddingBottom: '300%'
    },
    '&.ratio-3x1 .MuiGridListTile-tile': {
      paddingBottom: '33.33%'
    },
    '&.ratio-2.85x1 .MuiGridListTile-tile': {
      paddingBottom: '35.09%'
    }
  }
})

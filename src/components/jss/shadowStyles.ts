import { makeStyles } from '@material-ui/core/styles'

const useShadowStyles = makeStyles({
  faded: {
    boxShadow:
      '0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)'
  },
  float: {
    boxShadow: '0 16px 40px -12.125px rgba(0,0,0,0.3)'
  },
  hover: {
    boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(2px)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
    }
  },
  lightTop: {
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    transition: '0.3s',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)'
    }
  },
  bouncy: {
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:hover': {
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
      transform: 'scale(1.04)'
    }
  },
  soft: {
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.12)',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
    }
  }
})

export default useShadowStyles

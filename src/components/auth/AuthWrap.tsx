import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import React, { FunctionComponent } from 'react'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import { useMediaQuery } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginRoot: {
      [theme.breakpoints.up('sm')]: {
        backgroundImage:
          'url(https://img2.storyblok.com/f/68698/4060x1920/cf28e10528/ladenburg_neckarwiese_panorama_2.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      },
      display: 'flex'
    },
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  })
)

const AuthWrap: FunctionComponent = ({ children }) => {
  const classes = useStyles()
  const theme = useTheme()
  const biggerXs = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <div className={classes.loginRoot}>
      <Container maxWidth="sm" className={classes.loginContainer}>
        {biggerXs ? (
          <Box my={5}>
            <Card raised>{children}</Card>
          </Box>
        ) : (
          <div>{children}</div>
        )}
      </Container>
    </div>
  )
}

export default AuthWrap

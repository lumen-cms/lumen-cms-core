import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import React, { FunctionComponent } from 'react'
import { Theme, useTheme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { useMediaQuery } from '@mui/material'

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

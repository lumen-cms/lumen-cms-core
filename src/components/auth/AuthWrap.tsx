import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import React, { FunctionComponent, PropsWithChildren } from 'react'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

const AuthWrap: FunctionComponent<PropsWithChildren<unknown>> = ({
  children
}) => {
  const theme = useTheme()
  const biggerXs = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <Box
      sx={{
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
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {biggerXs ? (
          <Box my={5}>
            <Card raised>{children}</Card>
          </Box>
        ) : (
          <div>{children}</div>
        )}
      </Container>
    </Box>
  )
}

export default AuthWrap

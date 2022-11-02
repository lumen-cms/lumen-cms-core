import React from 'react'
import { Typography } from '@mui/material'
import { ImageListLightboxProps } from './imageListTypes'
import { ImageListItemStoryblok } from '../../typings/generated/components-schema'
import Carousel from 'nuka-carousel'
import Box from '@mui/material/Box'
import { ImageBase } from '../image/ImageBase'
import IconButton from '@mui/material/IconButton'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

// const useStyles = makeStyles()({
//   root: {
//     position: 'relative',
//     width: '100%',
//     height: '100%'
//   },
//   text: {
//     position: 'absolute',
//     width: '100%',
//     top: 0,
//     left: 0,
//     color: 'white',
//     flexDirection: 'column',
//     background: 'rgba(0,0,0,0.45)',
//     padding: '1rem 3rem 1rem 1rem'
//   }
// })

function CarouselImageItem({ content }: { content: ImageListItemStoryblok }) {
  // const { classes } = useStyles()
  const imageSource = content.source || ''

  return (
    <Box
      position={'relative'}
      width={'100%'}
      height={'100%'}
      display={'flex'}
      alignItems={'center'}
    >
      <ImageBase
        src={imageSource}
        style={{ height: '100%', objectFit: 'contain' }}
      />
      {(content.label || content.sub_title) && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            color: 'white',
            flexDirection: 'column',
            background: 'rgba(0,0,0,0.45)',
            padding: '1rem 3rem 1rem 1rem'
          }}
        >
          <Typography>{content.label}</Typography>
          <Typography variant="subtitle1">{content.sub_title}</Typography>
        </Box>
      )}
    </Box>
  )
}

export default function Swipe(props: ImageListLightboxProps) {
  const currentIndex = props.elements.findIndex(
    (i) => i._uid === props.lightbox
  )

  return (
    <Carousel
      slideIndex={currentIndex}
      style={{
        height: '100vh'
      }}
      renderCenterLeftControls={({ previousDisabled, previousSlide }) => (
        <IconButton
          size={'large'}
          onClick={previousSlide}
          disabled={previousDisabled}
        >
          <ChevronLeft fontSize={'large'} />
        </IconButton>
      )}
      renderCenterRightControls={({ nextDisabled, nextSlide }) => (
        <IconButton size={'large'} onClick={nextSlide} disabled={nextDisabled}>
          <ChevronRight fontSize={'large'} />
        </IconButton>
      )}
    >
      {props.elements.map((item) => (
        <CarouselImageItem content={item} key={item._uid} />
      ))}
    </Carousel>
  )
}

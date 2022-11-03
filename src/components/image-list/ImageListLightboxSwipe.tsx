import React from 'react'
import { Typography } from '@mui/material'
import { ImageListLightboxProps } from './imageListTypes'
import { ImageListItemStoryblok } from '../../typings/generated/components-schema'
import Box from '@mui/material/Box'
import { ImageBase } from '../image/ImageBase'
import LmNukaCarousel from '../slider/LmNukaCarousel'

function CarouselImageItem({ content }: { content: ImageListItemStoryblok }) {
  const imageSource = content.source || ''

  return (
    <Box
      position={'relative'}
      width={'100%'}
      height={'100vh'}
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
    <LmNukaCarousel
      slideIndex={currentIndex}
      style={{
        height: '100vh'
      }}
    >
      {props.elements.map((item) => (
        <CarouselImageItem content={item} key={item._uid} />
      ))}
    </LmNukaCarousel>
  )
}

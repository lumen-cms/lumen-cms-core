import { FC, PropsWithChildren } from 'react'
import { Grid } from '@mui/material'
import { LmGalleryRowProps } from './LmGalleryRow'
import { Parallax } from 'react-scroll-parallax'

const LmGalleryRowContainer: FC<PropsWithChildren<LmGalleryRowProps>> = ({
  children,
  options,
  content
}) => {
  return (
    <Parallax
      id={'row-' + content._uid}
      translateX={content.scroll_to_left ? [0, -100] : [-100, 0]}
    >
      <Grid
        direction={'row'}
        container
        wrap={'nowrap'}
        className={'lm-gallery-row'}
        style={{
          gap: options.space_between_images + 'px'
        }}
      >
        {children}
      </Grid>
    </Parallax>
  )
}

export default LmGalleryRowContainer

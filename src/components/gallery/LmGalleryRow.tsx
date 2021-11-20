import {
  GalleryRowStoryblok,
  GalleryStoryblok
} from '../../typings/generated/components-schema'
import LmGalleryImage from './LmGalleryImage'
import { Grid } from '@material-ui/core'
import { FC, useRef } from 'react'
import useScrollPosition from '@react-hook/window-scroll'
import { ClassNameMap } from '@material-ui/core/styles/withStyles'

type LmGalleryRowProps = {
  content: GalleryRowStoryblok
  options: GalleryStoryblok
  inView: boolean
  imageStyles: ClassNameMap<'advanced'>
}

const ContainerWrap: FC<LmGalleryRowProps> = ({
  children,
  inView,
  options,
  content
}) => {
  const initMinus = useRef<number>()
  const scrollY = useScrollPosition(60 /*fps*/)
  if (!initMinus.current && inView) {
    initMinus.current = scrollY
  }
  let calculatedY = scrollY - (initMinus.current || 0)
  let starting = inView ? calculatedY : scrollY
  if (content.scroll_to_left) {
    starting = starting * -1
  }
  return (
    <div
      style={{
        ...(content.scroll_to_left
          ? {}
          : { transform: 'translateX(-160%)!important' })
      }}
    >
      <Grid
        direction={'row'}
        container
        wrap={'nowrap'}
        className={'lm-gallery-row'}
        style={{
          gap: options.space_between_images + 'px',
          transform: `translate3d(${starting}px, 0px, 0px)`
        }}
      >
        {children}
      </Grid>
    </div>
  )
}

export default function LmGalleryRow(props: LmGalleryRowProps) {
  const { content, options, imageStyles } = props
  const length = content.content?.length || 0
  return (
    <ContainerWrap {...props}>
      {content.content?.map((blok, index) => (
        <Grid item xs="auto" key={blok._uid}>
          <LmGalleryImage
            content={blok}
            options={options}
            imageStyles={imageStyles}
          />
          {index < length && (
            <div
              style={{ paddingBottom: options.space_between_rows + 'px' }}
            ></div>
          )}
        </Grid>
      ))}
    </ContainerWrap>
  )
}

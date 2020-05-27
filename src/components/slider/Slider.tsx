import SwipeableViews from 'react-swipeable-views'
import React, { CSSProperties, useState } from 'react'
import clsx from 'clsx'
import { SliderStoryblok } from '../../typings/generated/components-schema'
import { SectionProps } from '../section/Section'
import { LmSliderChild } from './SliderChild'
import { makeStyles } from '@material-ui/core/styles'
import InvertedIndicator from './InvertedIndicator'
import Typography from '@material-ui/core/Typography'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import { useAppContext } from '../provider/AppProvider'

const chunkArray = (myArray: Element[], chunkSize: number) => {
  const results = []
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize))
  }
  return results
}

export const useStyles = makeStyles({
  carousel: {
    position: 'relative',
    '& [data-swipeable="true"]': {
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      '& > div': {
        overflow: 'hidden',
        height: '100%',
        width: '100%'
      }
    },
    '& .react-swipeable-view-container .MuiContainer-root': {
      padding: '0px !important',
      margin: '0px !important',
      maxWidth: 'inherit !important'
    },

    '&.carousel__arrows_dark': {
      '& .MuiSvgIcon-root': {
        color: 'rgba(0,0,0,0.8)'
      }
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
  }
})


export type LmSliderProps = { content: SliderStoryblok }

export function LmSlider({ content }: LmSliderProps): JSX.Element {
  const [slide, setSlide] = useState(0)
  const { ComponentRender } = useAppContext()
  const { isMobile } = useDeviceDimensions()
  const classes = useStyles()
  const wrapInColumns = content.slides_per_view && !isMobile
  const contentBody = content.body || []
  const body = wrapInColumns ? chunkArray(contentBody.slice(0), content.slides_per_view as number) : contentBody
  const properties = content.property || []
  const styles: CSSProperties = {}
  const paginationClasses = clsx(
    'carousel-indicators',
    { 'd-none': properties.includes('hide_pagination') }
  )
  const carouselPrevClasses = clsx(
    'carousel-control-prev',
    { 'd-none': properties.includes('hide_arrows') }
  )
  const carouselNextClasses = clsx(
    'carousel-control-next',
    { 'd-none': properties.includes('hide_arrows') }
  )
  const carouselClasses = clsx(
    classes.carousel, 'carousel slide', properties.map(i => 'carousel__' + i)
  )

  function handleChangeIndex(item: any) {
    setSlide(body.findIndex(i => i._uid === item._uid))
  }

  if (content.background_color) {
    styles.backgroundColor = content.background_color && content.background_color.rgba
  }

  return (
    <div className={carouselClasses} style={styles}>
      <SwipeableViews index={slide}
                      onChangeIndex={(i) => setSlide(i)}>
        {wrapInColumns ? body.map((child, index) => {
          return <LmSliderChild key={`swipeable_${index}`}
                                body={child}
                                sectionVariant={content.section_variant} />
        }) : body.map((item, i) => {
          if (item.component === 'section') {
            let newOpts: SectionProps = {
              ...item,
              presetVariant: content.section_variant || 'transparent'
            }
            return ComponentRender({ content: newOpts, i })
          }
          return ComponentRender({ content: item, i })
        })}
      </SwipeableViews>
      <a className={carouselPrevClasses}
         role="button"
         onClick={() => setSlide(slide === 0 ? body.length - 1 : slide - 1)}>
        <ChevronLeft />
        <Typography variant={'srOnly'}>Previous</Typography>
      </a>
      <a className={carouselNextClasses}
         role="button"
         onClick={() => setSlide(slide === body.length - 1 ? 0 : slide + 1)}>
        <ChevronRight />
        <Typography variant={'srOnly'}>Next</Typography>
      </a>
      <div className={paginationClasses}>
        {body.map((item, i) => (
          <InvertedIndicator key={item._uid || `pagination_${i}`}
                             active={slide === i}
                             color={properties.includes('pagination_dark') ? 'dark' : 'light'}
                             onClick={() => handleChangeIndex(item)} />
        ))}
      </div>
    </div>
  )
}

import React from 'react'
import ChevronLeft from 'mdi-material-ui/ChevronLeft'
import ChevronRight from 'mdi-material-ui/ChevronRight'
import CircleMedium from 'mdi-material-ui/CircleMedium'
import CircleSmall from 'mdi-material-ui/CircleSmall'
import Minus from 'mdi-material-ui/Minus'
import MinusThick from 'mdi-material-ui/MinusThick'
import { LmComponentRender } from '@LmComponentRender'
import IconButton from '@mui/material/IconButton'
import { LmSliderChild } from './SliderChild'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import { SectionProps } from '../section/sectionTypes'
import { LmSliderProps } from './sliderTypes'
import Carousel from 'nuka-carousel'
import Box from '@mui/material/Box'

const chunkArray = (myArray: any, chunkSize: number) => {
  const results = []
  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize))
  }
  return results
}

const DARK = 'rgba(0,0,0,0.8)'
const LIGHT = 'rgba(255,255,255,0.8)'

export default function LmSlider({ content }: LmSliderProps) {
  const autoSlide = !!content.autoslide
  const { isMobile } = useDeviceDimensions()
  const wrapInColumns = content.slides_per_view && !isMobile
  const contentBody: LmSliderProps['content']['body'] = content.body || []
  const body = wrapInColumns
    ? chunkArray(contentBody.slice(0), content.slides_per_view as number)
    : contentBody
  const properties = content.property || []

  const ActiveIndicator = () =>
    !properties.includes('pagination_circle') ? (
      <CircleMedium />
    ) : (
      <MinusThick />
    )
  const DefaultIndicator = () =>
    !properties.includes('pagination_circle') ? <CircleSmall /> : <Minus />

  let showLeftRightArrow = !['hide_arrows', 'arrows_beside_pagination'].some(
    (i) => properties.includes(i as any)
  )
  let isDarkPagination = properties.includes('pagination_dark')
  let isDarkArrows = properties.includes('arrows_dark')
  return (
    <Box
      sx={{
        backgroundColor: content.background_color?.rgba ?? undefined
      }}
    >
      <Carousel
        disableAnimation={content.disable_transition}
        pauseOnHover={content.pause_on_hover}
        autoplay={autoSlide}
        wrapAround={true}
        autoplayInterval={autoSlide ? Number(content.autoslide) : undefined}
        renderBottomCenterControls={({
          pagingDotsIndices,
          goToSlide,
          currentSlide,
          previousSlide,
          nextSlide
        }) => {
          return (
            <Box
              display={
                properties.includes('hide_pagination') ? 'none' : undefined
              }
              marginBottom={
                properties.includes('pagination_below_content')
                  ? '-64px'
                  : undefined
              }
              color={isDarkPagination ? DARK : LIGHT}
            >
              <IconButton
                sx={{
                  display: properties.includes('arrows_beside_pagination')
                    ? 'inline-flex'
                    : 'none'
                }}
                size="small"
                onClick={() => previousSlide()}
                color={'inherit'}
              >
                <ChevronLeft color={'inherit'} />
              </IconButton>
              {pagingDotsIndices.map((i) => (
                <IconButton
                  color="inherit"
                  size="small"
                  key={`pagination_${i}`}
                  onClick={() => goToSlide(i)}
                >
                  {currentSlide === i ? (
                    <ActiveIndicator />
                  ) : (
                    <DefaultIndicator />
                  )}
                </IconButton>
              ))}
              <IconButton
                onClick={() => nextSlide()}
                color="inherit"
                size="small"
                sx={{
                  display: properties.includes('arrows_beside_pagination')
                    ? 'inline-flex'
                    : 'none'
                }}
              >
                <ChevronRight color={'inherit'} />
              </IconButton>
            </Box>
          )
        }}
        renderCenterLeftControls={({ previousDisabled, previousSlide }) =>
          showLeftRightArrow ? (
            <IconButton
              size={'large'}
              onClick={previousSlide}
              disabled={previousDisabled}
              sx={{
                color: isDarkArrows ? DARK : LIGHT,
                fontSize: '4rem'
              }}
            >
              <ChevronLeft fontSize={'inherit'} />
            </IconButton>
          ) : null
        }
        renderCenterRightControls={({ nextDisabled, nextSlide }) =>
          showLeftRightArrow ? (
            <IconButton
              size={'large'}
              onClick={nextSlide}
              disabled={nextDisabled}
              sx={{
                color: isDarkArrows ? DARK : LIGHT,
                fontSize: '4rem'
              }}
            >
              <ChevronRight fontSize={'inherit'} />
            </IconButton>
          ) : null
        }
      >
        {wrapInColumns
          ? body.map((child, index) => {
              return (
                <LmSliderChild
                  key={String(`swipeable_${index}`)}
                  body={child}
                  sectionVariant={content.section_variant}
                />
              )
            })
          : body.map((item) => {
              if (item.component === 'section') {
                const newOpts: SectionProps = {
                  ...item,
                  presetVariant: content.section_variant || 'transparent'
                }
                return (
                  <LmComponentRender content={newOpts} key={newOpts._uid} />
                )
              }
              return <LmComponentRender content={item} key={item._uid} />
            })}
      </Carousel>
    </Box>
  )
}

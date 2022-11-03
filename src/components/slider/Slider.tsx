import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import { SectionProps } from '../section/sectionTypes'
import { LmSliderProps } from './sliderTypes'
import Box from '@mui/material/Box'
import LmNukaCarousel from './LmNukaCarousel'

export default function LmSlider({ content }: LmSliderProps) {
  const autoSlide = !!content.autoslide
  const { isMobile } = useDeviceDimensions()
  const body: LmSliderProps['content']['body'] = content.body || []
  const properties = content.property || []

  return (
    <Box
      sx={{
        backgroundColor: content.background_color?.rgba ?? undefined
      }}
    >
      <LmNukaCarousel
        disableAnimation={content.disable_transition}
        pauseOnHover={content.pause_on_hover}
        autoplay={autoSlide}
        slidesToShow={Number(!isMobile ? content.slides_per_view || 1 : 1)}
        autoplayInterval={autoSlide ? Number(content.autoslide) : undefined}
        darkArrows={properties.includes('arrows_dark')}
        darkPagination={properties.includes('pagination_dark')}
        hideArrows={['hide_arrows', 'arrows_beside_pagination'].some((i) =>
          properties.includes(i as any)
        )}
        hidePagination={properties.includes('hide_pagination')}
        paginationCircle={properties.includes('pagination_circle')}
        arrowsBesidePagination={properties.includes('arrows_beside_pagination')}
        paginationBelowContent={properties.includes('pagination_below_content')}
      >
        {body.map((item) => {
          if (item.component === 'section') {
            const newOpts: SectionProps = {
              ...item,
              presetVariant: content.section_variant || 'transparent'
            }
            return <LmComponentRender content={newOpts} key={newOpts._uid} />
          }
          return <LmComponentRender content={item} key={item._uid} />
        })}
      </LmNukaCarousel>
    </Box>
  )
}

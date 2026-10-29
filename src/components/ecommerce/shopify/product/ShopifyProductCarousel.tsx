import Image from 'next/image'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { ShopifyProductItemProps } from '../shopifyTypes'
import LmNukaCarousel from '../../../slider/LmNukaCarousel'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

export function ShopifyProductCarousel({ item }: ShopifyProductItemProps) {
  const { selectedVariant, onVariantSelect, config } = useShopifySdkContext()
  const theme = useTheme()
  const columnWidth = config?.columns_first_width
    ? Number(config.columns_first_width)
    : 6
  const desktopWidth =
    columnWidth > 0 && columnWidth <= 12 ? (columnWidth / 12) * 100 : 100
  const imageSizes = `${theme.breakpoints
    .up('sm')
    .replace('@media ', '')} ${desktopWidth}vw, 100vw`
  const variants = item.variants.edges
  const height = config?.image_container_height
    ? Number(config.image_container_height)
    : 300

  const currentCarouselIndex =
    variants.findIndex((i) => i.node.id === selectedVariant?.id) < 0
      ? 0
      : variants.findIndex((i) => i.node.id === selectedVariant?.id) || 0
  return (
    <LmNukaCarousel
      hidePagination={config.carousel_hide_indicator && variants.length === 1}
      darkPagination
      darkArrows
      autoplay={!!config.carousel_auto_play}
      slideIndex={currentCarouselIndex}
      afterSlide={(index) => {
        onVariantSelect({
          ...variants[index || 0].node,
          productTitle: item.title
        })
      }}
    >
      {(variants || []).map((currentItem) => (
        <Box
          key={currentItem.node.id}
          sx={{
            height: height
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Image
              src={currentItem.node.image?.transformedSrc}
              alt={currentItem.node.title}
              fill
              sizes={imageSizes}
              style={{
                objectFit: 'contain'
              }}
            />
          </Box>
        </Box>
      ))}
    </LmNukaCarousel>
  )
}

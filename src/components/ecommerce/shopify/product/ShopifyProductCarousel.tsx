import React from 'react'
import Carousel from 'react-material-ui-carousel'
import Image from 'next/image'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  flexboxCentering: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  }
})

export function ShopifyProductCarousel({ item }: ShopifyProductItemProps) {
  const { selectedVariant, onVariantSelect, config } = useShopifySdkContext()
  const variants = item.variants.edges
  const { classes } = useStyles()
  const height = config?.image_container_height
    ? Number(config.image_container_height)
    : 300

  const currentCarouselIndex =
    variants.findIndex((i) => i.node.id === selectedVariant?.id) < 0
      ? 0
      : variants.findIndex((i) => i.node.id === selectedVariant?.id) || 0
  return (
    <Carousel
      fullHeightHover
      indicators={!config.carousel_hide_indicator && variants.length > 1}
      autoPlay={!!config.carousel_auto_play}
      animation="slide"
      navButtonsAlwaysInvisible={variants.length === 1}
      index={currentCarouselIndex as number}
      onChange={(index) => {
        onVariantSelect({
          ...variants[index || 0].node,
          productTitle: item.title
        })
      }}
    >
      {(variants || []).map((currentItem) => (
        <div
          key={currentItem.node.id}
          style={{
            height
          }}
        >
          <div className={classes.flexboxCentering}>
            <Image
              src={currentItem.node.image?.transformedSrc}
              alt={currentItem.node.title}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      ))}
    </Carousel>
  )
}

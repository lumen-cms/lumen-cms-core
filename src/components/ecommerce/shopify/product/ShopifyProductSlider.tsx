import React from 'react'
import { ProductVariant } from 'shopify-buy'
import { makeStyles } from '@material-ui/core/styles'
import Carousel from 'react-material-ui-carousel'
import { useShopifySdkContext } from '../context/ShopifySdkContext'

const useStyles = makeStyles({
  flexboxCentering: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export function ShopifyProductSlider({
  variants
}: {
  variants: ProductVariant[]
}) {
  const { selectedVariant, onVariantSelect, config } = useShopifySdkContext()
  const classes = useStyles()
  const height = config?.image_container_height
    ? Number(config.image_container_height)
    : 300

  return (
    <Carousel
      fullHeightHover
      indicators={!config.carousel_hide_indicator}
      autoPlay={!!config.carousel_auto_play}
      animation="slide"
      index={
        variants.findIndex((i) => i.id === selectedVariant?.id) < 0
          ? 0
          : variants.findIndex((i) => i.id === selectedVariant?.id)
      }
      onChange={(index: number) => {
        onVariantSelect(variants[index])
      }}
    >
      {(variants || []).map((item) => (
        <div
          key={item.id}
          style={{
            height
          }}
        >
          <div className={classes.flexboxCentering}>
            <img
              src={item.image.src}
              alt={item.title}
              style={{
                width: 'auto',
                height: '100%'
              }}
            />
          </div>
        </div>
      ))}
    </Carousel>
  )
}

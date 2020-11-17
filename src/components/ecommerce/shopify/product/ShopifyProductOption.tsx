import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'
import { LmComponentRender } from '@LmComponentRender'
import { ShopifyProductOptionProps } from '../shopifyTypes'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import {
  ButtonStoryblok,
  HeadlineStoryblok
} from '../../../../typings/generated/components-schema'

const useStyles = makeStyles((theme: Theme) => ({
  redColor: {
    color: theme.palette.error.main
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
    '& > button': {
      marginRight: theme.spacing(2)
    }
  },
  buttonSpace: {
    marginTop: theme.spacing(2)
  }
}))

export function ShopifyProductOption({ option }: ShopifyProductOptionProps) {
  const { selectedVariant, onVariantSelect, config } = useShopifySdkContext()
  const { currency_prefix } = config
  const classes = useStyles()
  useEffect(() => {
    if (!selectedVariant) {
      onVariantSelect(option.variants[0])
    }
  }, [selectedVariant, option.variants, onVariantSelect])
  return (
    <div>
      <div className={classes.buttonSpace}>
        {selectedVariant && (
          <LmComponentRender
            content={
              {
                _uid: '234',
                component: 'headline',
                typography: 'headline5',
                align: 'center',
                ...(config?.product_price || {})
              } as HeadlineStoryblok
            }
          >
            {selectedVariant.compareAtPrice && (
              <s className={classes.redColor}>
                {currency_prefix || ''} {selectedVariant.compareAtPrice}
              </s>
            )}{' '}
            <span>
              {currency_prefix || ''} {selectedVariant.price}
            </span>
          </LmComponentRender>
        )}
      </div>
      <div className={classes.buttonSpace}>
        <LmComponentRender
          content={
            {
              component: 'headline',
              _uid: '3453',
              align: 'center',
              text: option.name,
              typography: 'headline6',
              color: 'textSecondary',
              ...(config?.product_variant_name || {})
            } as HeadlineStoryblok
          }
        />
      </div>
      <div className={classes.buttonContainer}>
        {option.variants.map((variant) => (
          <LmComponentRender
            key={variant.id}
            onClick={() => {
              onVariantSelect(variant)
            }}
            content={
              {
                component: 'button',
                variant:
                  selectedVariant?.id === variant.id
                    ? 'unelevated'
                    : 'outlined',
                ...(selectedVariant?.id === variant.id
                  ? config?.product_active_variant?.length
                    ? config.product_active_variant[0]
                    : {}
                  : config?.product_variant?.length
                  ? config.product_variant[0]
                  : {}),
                label: variant.title
              } as ButtonStoryblok
            }
          />
        ))}
      </div>
    </div>
  )
}

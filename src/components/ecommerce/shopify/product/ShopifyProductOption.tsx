import React from 'react'
import makeStyles from '@mui/styles/makeStyles';
import { Theme } from '@mui/material'
import { LmComponentRender } from '@LmComponentRender'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import {
  ButtonStoryblok,
  HeadlineStoryblok
} from '../../../../typings/generated/components-schema'
import { useEffectOnce } from 'react-use'

const useStyles = makeStyles((theme: Theme) => ({
  redColor: {
    color: theme.palette.error.main
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
    columnGap: theme.spacing(2),
    rowGap: theme.spacing(1)
  },
  buttonSpace: {
    marginTop: theme.spacing(2)
  }
}))

export function ShopifyProductOptions({ item }: ShopifyProductItemProps) {
  const { selectedVariant, onVariantSelect, config } = useShopifySdkContext()

  const { currency_prefix } = config
  const classes = useStyles()
  const firstVariant = item.variants?.edges[0].node
  useEffectOnce(() => {
    onVariantSelect({ ...firstVariant, productTitle: item.title })
  })
  const hasMultipleOptions = item.variants.edges?.length > 1
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
                ...(config?.product_price?.[0] || {})
              } as HeadlineStoryblok
            }
          >
            {selectedVariant.compareAtPriceV2 && (
              <s className={classes.redColor}>
                {currency_prefix || ''}{' '}
                {selectedVariant.compareAtPriceV2?.amount}
              </s>
            )}{' '}
            <span>
              {currency_prefix || ''} {selectedVariant.priceV2?.amount}
            </span>
          </LmComponentRender>
        )}
      </div>
      {hasMultipleOptions && (
        <>
          <div className={classes.buttonSpace}>
            <LmComponentRender
              content={
                {
                  component: 'headline',
                  _uid: '3453',
                  align: 'center',
                  text:
                    selectedVariant?.selectedOptions &&
                    selectedVariant?.selectedOptions[0]?.name,
                  typography: 'headline6',
                  color: 'textSecondary',
                  ...(config?.product_variant_name || {})
                } as HeadlineStoryblok
              }
            />
          </div>
          <div className={classes.buttonContainer}>
            {item.variants.edges.map((variant) => (
              <LmComponentRender
                key={variant.node.id}
                onClick={() => {
                  onVariantSelect({ ...variant.node, productTitle: item.title })
                }}
                content={
                  {
                    component: 'button',
                    variant:
                      selectedVariant?.id === variant.node.id
                        ? 'unelevated'
                        : 'outlined',
                    ...(selectedVariant?.id === variant.node.id
                      ? config?.product_active_variant?.length
                        ? config.product_active_variant[0]
                        : {}
                      : config?.product_variant?.length
                      ? config.product_variant[0]
                      : {}),
                    label: variant.node.title
                  } as ButtonStoryblok
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

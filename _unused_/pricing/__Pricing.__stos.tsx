import { storiesOf } from '@storybook/react'
import Pricing from './Pricing'
import {
  HeadlineStoryblok,
  ImageStoryblok,
  PricingItemStoryblok,
  PricingStoryblok
} from '../../typings/generated/components-schema'
import * as React from 'react'

const items: PricingItemStoryblok[] = [{
  _uid: '4212',
  component: 'pricing_item',
  image: [{
    component: 'image',
    _uid: '1231',
    source: 'https://a.storyblok.com/f/57008/4541x2202/dc46a24330/bicycles-608747.jpg'
  }] as ImageStoryblok[],
  price: [{
    component: 'headline',
    _uid: '2132',
    text: '100 $'
  }] as HeadlineStoryblok[],
  title: [{
    component: 'headline',
    _uid: '2132',
    text: 'Product 1'
  }] as HeadlineStoryblok[]
}, {
  _uid: '1231',
  component: 'pricing_item',
  image: [{
    component: 'image',
    _uid: '1231',
    source: 'https://a.storyblok.com/f/57008/4541x2202/dc46a24330/bicycles-608747.jpg'
  }] as ImageStoryblok[],
  title: [{
    _uid: '23412',
    component: 'headline',
    text: 'Product 2'
  }] as HeadlineStoryblok[],
  price: [{
    component: 'headline',
    _uid: '2132',
    text: '110 $'
  }] as HeadlineStoryblok[]
}]

const props: PricingStoryblok = {
  _uid: '123',
  component: 'pricing',
  body: items
}

storiesOf('Pricing', module)
  .add(
    'Pricing',
    () => (
      <Pricing content={props} />
    )
  )

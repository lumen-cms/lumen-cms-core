import {  LmComponentRender as LmButtonList } from '../src/'
import { ButtonListStoryblok, ButtonStoryblok } from '../src/typings/generated/components-schema'
import * as React from 'react'
import { storyButton, storyButtonList } from '../src/storybook/core/various'

const twitterPng = 'https://img2.storyblok.com/f/66717/273x256/42d8e47bd5/twitter-icon.png'
const fcbkPng = 'https://a.storyblok.com/f/66717/273x256/1af4758e5f/fb-icon.png'
const instaPng = 'https://img2.storyblok.com/f/66717/273x256/275fe57666/insta-icon.png'
const defaultProps: ButtonStoryblok = {
  label: 'Text Button',
  _uid: '123',
  component: 'button'
}

const variant1: ButtonStoryblok = {
  ...defaultProps,
  label: 'Large Button',
  size: 'lm-button-large',
  _uid: '1235'
}

const props: ButtonListStoryblok = {
  ...defaultProps,
  component: 'button_list',
  body: [defaultProps, variant1]
}

const props2: ButtonListStoryblok = {
  ...props,
  body: [defaultProps, variant1],
  property: ['align_right']
}


const icons: ButtonListStoryblok = {
  ...props,
  body: [{
    _uid: '34334',
    component: 'button',
    icon: {
      name: 'home'
    }
  }, {
    _uid: '544848',
    component: 'button',
    icon: {
      name: 'apps'
    }
  }, {
    _uid: '44878',
    component: 'button',
    icon: {
      name: 'facebook'
    }
  }] as ButtonStoryblok[]
}

const images: ButtonListStoryblok = {
  ...props,
  body: [{
    _uid: '34334',
    component: 'button',
    image: twitterPng
  }, {
    _uid: '544848',
    component: 'button',
    image: instaPng

  }, {
    _uid: '44878',
    component: 'button',
    image: fcbkPng
  }] as ButtonStoryblok[]
}

export default {
  title: 'Button List'
}

export const TextList = () => (
  <>
    <div>
      <LmButtonList content={props2} />
    </div>
    <div>
      <LmButtonList content={props} />
    </div>
  </>
)
export const IconList = () => (
  <>
    <div>
      <LmButtonList content={icons} />
    </div>
    <div>
      <LmButtonList content={{
        ...icons,
        body: icons.body && icons.body.map((i: ButtonStoryblok) => ({ ...i, size: 'dense' }))
      }} />
      <LmButtonList content={{
        ...icons,
        body: icons.body && icons.body.map((i: ButtonStoryblok) => ({ ...i, size: 'lm-button-large' }))
      }} />
      <LmButtonList content={{
        ...icons,
        body: icons.body && icons.body.map((i: ButtonStoryblok) => ({ ...i, size: 'lm-button-xlarge' }))
      }} />
    </div>
  </>
)

export const FabList = () => (
  <>
    <h4>Default</h4>
    <div>
      <LmButtonList content={{
        ...icons,
        body: icons.body && icons.body.map((i: ButtonStoryblok) => ({ ...i, variant: 'fab' }))
      }} />
    </div>
    <h4>Dense</h4>
    <div>
      <LmButtonList content={{
        ...icons,
        body: icons.body && icons.body.map((i: ButtonStoryblok) => ({ ...i, size: 'dense', variant: 'fab' }))
      }} />
      <h4>Large</h4>
      <LmButtonList content={{
        ...icons,
        body: icons.body && icons.body.map((i: ButtonStoryblok) => ({
          ...i,
          size: 'lm-button-large',
          variant: 'fab'
        }))
      }} />
      <h4>X-Large</h4>
      <LmButtonList content={{
        ...icons,
        body: icons.body && icons.body.map((i: ButtonStoryblok) => ({
          ...i,
          size: 'lm-button-xlarge',
          variant: 'fab'
        }))
      }} />
    </div>
  </>
)

export const ImageList = () => (
  <>
    <h4>Default</h4>
    <div>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({ ...i }))
      }} />
    </div>
    <h4>Dense</h4>
    <div>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({ ...i, size: 'dense' }))
      }} />
      <h4>Large</h4>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({
          ...i,
          size: 'lm-button-large'
        }))
      }} />
      <h4>X-Large</h4>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({
          ...i,
          size: 'lm-button-xlarge'
        }))
      }} />
    </div>
  </>
)

export const ImageListFab = () => (
  <>
    <h4>Default</h4>
    <div>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({ ...i, variant: 'fab' }))
      }} />
    </div>
    <h4>Dense</h4>
    <div>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({ ...i, size: 'dense', variant: 'fab' }))
      }} />
      <h4>Large</h4>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({
          ...i,
          size: 'lm-button-large',
          variant: 'fab'
        }))
      }} />
      <h4>X-Large</h4>
      <LmButtonList content={{
        ...images,
        body: images.body && images.body.map((i: ButtonStoryblok) => ({
          ...i,
          size: 'lm-button-xlarge',
          variant: 'fab'
        }))
      }} />
    </div>
  </>
)

export const Playground = () => {
  return (
    <div className="p-5">
      <LmButtonList content={{
        ...storyButtonList(),
        body: [
          storyButton({ count: 1 }),
          storyButton({ count: 2 }),
          storyButton({ count: 3 }),
          storyButton({ count: 4 })
        ]
      }} />
    </div>
  )
}


import {  LmComponentRender as LmIcon } from '../src/'
import { storyIcon } from '../src/storybook/core/various'
import React from 'react'

export default {
  title: 'Icon'
}

export const Playground = () => (
  <>
    <LmIcon content={storyIcon({
      count: 1, options: {
        name: {
          name: 'home'
        },
        size: 'xmall'
      }
    })} />
    <LmIcon content={storyIcon({
      count: 2, options: {
        name: {
          name: 'home'
        },
        size: 'small'
      }
    })} />
    <LmIcon content={storyIcon({
      count: 3, options: {
        name: {
          name: 'home'
        },
        size: 'medium'
      }
    })} />
    <LmIcon content={storyIcon({
      count: 4, options: {
        name: {
          name: 'home'
        },
        size: 'large',
        class_names: {
          values: ['text-primary']
        }
      }
    })} />
    <LmIcon content={storyIcon({
      count: 5, options: {
        name: {
          name: 'home'
        },
        size: 'xxlarge',
        class_names: {
          values: ['text-danger']
        }
      }
    })} />
    <LmIcon content={storyIcon({
      count: 6, options: {
        name: {
          name: 'home'
        },
        size: 'xxxlarge'
      }
    })} />
    <LmIcon content={storyIcon({
      count: 7,
      options: {
        icon_url: 'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/airbnb.svg',
        size: 'xxxlarge'
      }
    })} />
  </>
)


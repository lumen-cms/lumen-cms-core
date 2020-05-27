import {  LmComponentRender as LmAvatar } from '../src/'
import React from 'react'
import { randomIntFromInterval, storyAvatar, storyImageUrls } from '../src/storybook/core/various'

export default {
  title: 'Avatar'
}

export const Playground = () => (
  <>
    <LmAvatar content={storyAvatar({
      count: 1,
      options: {
        size: 'dense',
        image: storyImageUrls[randomIntFromInterval(0, storyImageUrls.length - 1)]
      }
    })} /><br />
    <LmAvatar content={storyAvatar({
      count: 2,
      options: {
        variant: 'square',
        image: storyImageUrls[randomIntFromInterval(0, storyImageUrls.length - 1)]
      }
    })} /><br />
    <LmAvatar content={storyAvatar({
      count: 3,
      options: {
        variant: 'rounded',
        size: 'large',
        image: storyImageUrls[randomIntFromInterval(0, storyImageUrls.length - 1)]
      }
    })} /><br />
    <LmAvatar content={storyAvatar({
      count: 4,
      options: {
        size: 'xlarge',
        image: storyImageUrls[randomIntFromInterval(0, storyImageUrls.length - 1)]
      }
    })} /><br />
    <LmAvatar content={storyAvatar({
      count: 5,
      options: {
        size: 'dense',
        icon: {
          name: 'home'
        }
      }
    })} /><br />
    <LmAvatar content={storyAvatar({
      count: 6,
      options: {
        background_color: {
          rgba: '#231233'
        },
        icon: {
          name: 'ab-testing'
        }
      }
    })} /><br />
    <LmAvatar content={storyAvatar({
      count: 7,
      options: {
        size: 'large',
        variant: 'square',
        icon: {
          name: 'account-box-outline'
        }
      }
    })} /><br />
    <LmAvatar content={storyAvatar({
      count: 8,
      options: {
        size: 'xlarge',
        variant: 'rounded',
        icon: {
          name: 'airport'
        }
      }
    })} /><br />
  </>
)


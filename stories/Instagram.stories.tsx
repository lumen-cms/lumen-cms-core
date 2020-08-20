import React from 'react'
import { LmComponentRender as Renderer } from '../src/'
import { FlexRowStoryblok, InstagramPostStoryblok } from '../src/typings/generated/components-schema'
import { storyInstagramPost } from '../src/storybook/core/various'
import { storyFlexRow } from '../src/storybook/core/section'

export default {
  title: 'Instagram'
}

export const Basic = () => (
  <Renderer content={{
    ...storyInstagramPost({
      options: {
        url: 'https://www.instagram.com/p/CBm3rVllU23'
      },
    })
  } as InstagramPostStoryblok} />
)

export const List = () => (
  <Renderer content={{
    ...storyFlexRow({
      options:{
        justify: 'space-around'
      }
    }),
    body: [storyInstagramPost({
      options: {
        url: 'https://instagr.am/p/CDkuk8lluqS'
      },
      knob: 'Instagram Post 1'
    }), storyInstagramPost({
      options: {
        url: 'https://www.instagram.com/p/CBm3rVllU23'
      },
      knob: 'Instagram Post 2'
    })] as InstagramPostStoryblok[]
  } as FlexRowStoryblok} />
)



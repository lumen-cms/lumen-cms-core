import React from 'react'
import { LmComponentRender as Renderer } from '../src/'
import {
  FlexRowStoryblok,
  InstagramListStoryblok,
  InstagramPostStoryblok
} from '../src/typings/generated/components-schema'
import { storyInstagramList, storyInstagramPost } from '../src/storybook/core/various'
import { storyFlexRow } from '../src/storybook/core/section'

export default {
  title: 'Instagram'
}

export const Basic = () => (
  <Renderer content={{
    ...storyInstagramPost({
      options: {
        url: 'https://www.instagram.com/p/CBm3rVllU23'
      }
    })
  } as InstagramPostStoryblok} />
)

export const RowOfPosts = () => (
  <Renderer content={{
    ...storyFlexRow({
      options: {
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

export const ListOfIframes = () => (
  <Renderer content={{
    ...storyInstagramList({
      options: {
        username: 'baliinternships',
        type: 'iframe',
        max_posts: 6,
        column_count: '3'
      }
    })
  } as InstagramListStoryblok} />
)

export const ListOfImages = () => (
  <Renderer content={{
    ...storyInstagramList({
      options: {
        username: 'baliinternships',
        type: 'image',
        max_posts: 6,
        column_count: '3',
        hide_videos: false,
        column_gap: '16',
        height: 320
      }
    })
  } as InstagramListStoryblok} />
)


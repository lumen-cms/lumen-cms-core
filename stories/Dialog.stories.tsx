import { LmComponentRender as Element } from '../src/'
import * as React from 'react'
import { storyDialog } from '../src/storybook/core/various'
import {
  ButtonStoryblok,
  DialogStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  ImageStoryblok
} from '../src/typings/generated/components-schema'

export default {
  title: 'Dialog'
}

const body = [{
  component: 'headline',
  _uid: '123',
  text: 'Some Dialog Headline'
}, {
  component: 'image', _uid: '46464', source: 'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
}] as (HeadlineStoryblok | ImageStoryblok)[]

export const Playground = () => (
  <div style={{
    margin: '50px auto',
    width: '300px'
  }}>
    <Element content={{
      ...storyDialog({
        options: {
          title: 'Dialog Title'
        }
      }),
      body,
      trigger: [{
        component: 'button', _uid: '123', label: 'A button trigger'
      } as ButtonStoryblok]
    } as DialogStoryblok} />
    <div style={{ padding: '10px' }}></div>
    <Element content={{
      ...storyDialog({
        options: {
          title: 'Dialog Title'
        }
      }),
      body,
      trigger: [{
        component: 'headline', _uid: '1112', text: 'Headline Trigger'
      } as HeadlineStoryblok]
    } as DialogStoryblok} />
    <div style={{ padding: '10px' }}></div>
    <Element content={{
      ...storyDialog({
        count: 1,
        options: {
          title: 'Dialog Title'
        }
      }),
      body,
      trigger: [{
        component: 'image', _uid: '46464', source: 'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
      } as ImageStoryblok]
    } as DialogStoryblok} />
    <div style={{ padding: '10px' }}></div>
    <Element content={{
      no_padding: true,
      slide_up: true,
      body,
      ...storyDialog({
        count: 4
      }),
      prevent_close_button: true,
      trigger: [{
        component: 'icon',
        name: {
          name: 'home'
        },
        size: 'xxlarge',
        class_names: {
          values: ['text-danger']
        }
      } as IconStoryblok]
    } as DialogStoryblok} />


  </div>
)

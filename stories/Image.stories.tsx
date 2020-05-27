import { LmComponentRender as LmImage } from '../src/'
import {
  ColumnStoryblok,
  HeadlineStoryblok,
  ImageStoryblok,
  RowStoryblok
} from '../src/typings/generated/components-schema'
import * as React from 'react'
import { storyHeadline, storyImage } from '../src/storybook/core/various'
import { storyColumn, storyRow, storySection } from '../src/storybook/core/section'

const props: ImageStoryblok = {
  _uid: '123',
  component: 'image',
  source: 'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}

const svg: ImageStoryblok = {
  ...props,
  source: 'https://a.storyblok.com/f/57008/x/7dea868beb/cc_icons-badge_029.svg'
}

export default {
  title: 'Image'
}

export const Basic = () => (
  <div style={{
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    <LmImage content={props} />
    <LmImage content={{ ...props, property: ['rounded-circle'] }} />
    <LmImage content={{ ...props, property: ['rounded-0'] }} />
    <LmImage content={{ ...props, property: ['rounded'] }} />
    <LmImage content={{ ...props, property: ['img-thumbnail'] }} />
    <LmImage content={{ ...props, property: ['square'] }} />
    <LmImage content={{ ...props, property: ['rounded-circle'], height: 64 }} />
    <LmImage content={{ ...props, property: ['square'], height: 64 }} />
    <LmImage content={{ ...props, property: ['img-thumbnail'], height: 64 }} />
    <LmImage content={{ ...props, property: ['rounded'], height: 64 }} />
  </div>
)
export const ImageSVG = () => (
  <div style={{
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    <LmImage content={{ ...svg, height: 64 }} />
    <LmImage content={{ ...svg, color: { rgba: '#ccc' }, height: 64 }} />
    <LmImage content={{ ...svg, color: { rgba: '#eee' }, height: 64 }} />
    <LmImage content={{ ...svg, color: { rgba: '#ccc' }, height: 64 }} />
    <div className="p-4">
      <h4>Playground:</h4>
      <LmImage content={storyImage({
        options: {
          source: 'https://a.storyblok.com/f/57008/x/7dea868beb/cc_icons-badge_029.svg'
        }
      })} />

    </div>
  </div>
)
export const ImageFocalPoint = () => {
  const src = 'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div style={{
        height: '150px',
        overflow: 'hidden'
      }}>
        <LmImage content={storyImage({
          knob: 'Image width/height parent container',
          options: {
            source: src,
            focal_point: '50x0'
          }
        })} />
      </div>
      <br />
      <div style={{
        height: '150px',
        overflow: 'hidden'
      }}>
        <LmImage content={storyImage({
          knob: 'Same as 1. image different focal',
          options: {
            source: src,
            focal_point: '0x100'
          }
        })} />
      </div>
      <br />
      <div>
        <LmImage content={storyImage({
          knob: 'Image with height & width',
          options: {
            source: src,
            width: 500,
            height: 150,
            focal_point: '0x100'
          }
        })} />
      </div>
    </div>
  )
}

export const ImageInSections = () => (
  <LmImage content={{
    ...storySection(),
    body: [{
      ...storyRow(),
      body: [{
        ...storyColumn({ count: 1 }),
        width_general: 'auto',
        body: [{
          ...storyHeadline()
        } as HeadlineStoryblok]
      }, {
        ...storyColumn({ count: 2 }),
        width_general: 'auto',
        body: [{
          ...storyImage()
        } as ImageStoryblok]
      }] as ColumnStoryblok[]
    } as RowStoryblok]
  }} />
)
export const Playground = () => (
  <div style={{
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    <LmImage content={storyImage()} />
  </div>
)


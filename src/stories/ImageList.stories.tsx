import { LmComponentRender as LmImageList } from '@LmComponentRender'
import {
  ImageListItemStoryblok,
  ImageListStoryblok
} from '../typings/generated/components-schema'
import { storyImageList, storyImageListItem } from '../storybook/core/section'

const body: ImageListItemStoryblok[] = [
  {
    _uid: '1',
    component: 'image_list_item',
    source:
      'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png',
    label: 'First image'
  },
  {
    _uid: '2',
    component: 'image_list_item',
    source:
      'https://a.storyblok.com/f/57008/4541x2202/dc46a24330/bicycles-608747.jpg',
    label: 'Second image'
  },
  {
    _uid: '232',
    component: 'image_list_item',
    source:
      'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png',
    label: 'First image'
  },
  {
    _uid: 'fdldis',
    component: 'image_list_item',
    source:
      'https://a.storyblok.com/f/57008/4541x2202/dc46a24330/bicycles-608747.jpg',
    label: 'Second image'
  },
  {
    _uid: 'eferrs',
    component: 'image_list_item',
    source:
      'https://a.storyblok.com/f/57008/4541x2202/dc46a24330/bicycles-608747.jpg',
    label: 'Second image'
  }
]

const content: ImageListStoryblok = {
  _uid: '123',
  component: 'image_list',
  body
}

const content2: ImageListStoryblok = {
  _uid: '123',
  component: 'image_list',
  body,
  enable_lightbox: true
}

const content3: ImageListStoryblok = {
  _uid: '123',
  component: 'image_list',
  body,
  enable_lightbox: true,
  text_protection: true
}
const content4: ImageListStoryblok = {
  _uid: '123',
  component: 'image_list',
  body,
  enable_lightbox: true
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Layout/Image List'
}

export const Basic = () => (
  <>
    <LmImageList content={content} />
    <h3>Gap of 32</h3>
    <LmImageList content={{ ...content, column_gap: '32' }} />
  </>
)
Basic.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 10000 }
}
export const WithLightbox = () => <LmImageList content={content2} />
WithLightbox.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 10000 }
}
export const WithImageProtect = () => <LmImageList content={content3} />
WithImageProtect.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 10000 }
}
export const ImageRatio = () => (
  <>
    <h3>Masonry</h3>
    <LmImageList content={{ ...content4, masonry: true }} />
    <h3>Default aspect ratio</h3>
    <LmImageList content={content4} />
    <h3>Default 4x3</h3>
    <LmImageList
      content={{ ...content4, aspect_ratio: '4x3', image_crop: 'crop' }}
    />
    <h3>Default 3x4</h3>
    <LmImageList
      content={{ ...content4, aspect_ratio: '3x4', image_crop: 'crop' }}
    />
    <h3>Default 16x9</h3>
    <LmImageList
      content={{ ...content4, aspect_ratio: '16x9', image_crop: 'crop' }}
    />
    <h3>Default 2x3</h3>
    <LmImageList
      content={{ ...content4, aspect_ratio: '2x3', image_crop: 'crop' }}
    />
    <h3>Default 3x2</h3>
    <LmImageList
      content={{ ...content4, aspect_ratio: '3x2', image_crop: 'crop' }}
    />
    <h3>Default 1x1</h3>
    <LmImageList
      content={
        {
          ...content4,
          aspect_ratio: '1x1',
          image_crop: 'crop'
        } as ImageListStoryblok
      }
    />
    <h3>Fit in color:</h3>
    <LmImageList
      content={{ ...content4, aspect_ratio: '3x2', fit_in_color: 'ccc' }}
    />
    <LmImageList
      content={{ ...content4, aspect_ratio: '2x3', fit_in_color: 'ccc' }}
    />
  </>
)
ImageRatio.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 10000 }
}
export const Playground = () => (
  <div>
    <LmImageList
      content={{
        ...storyImageList({
          options: {
            column_count: '4',
            column_gap: '24'
          }
        }),
        body: [
          storyImageListItem({ count: 1 }),
          storyImageListItem({ count: 2 }),
          storyImageListItem({ count: 3 }),
          storyImageListItem({ count: 4 }),
          storyImageListItem({ count: 5 }),
          storyImageListItem({ count: 6 }),
          storyImageListItem({ count: 7 }),
          storyImageListItem({ count: 8 })
        ]
      }}
    />
  </div>
)
Playground.parameters = {
  // Sets the delay for a specific story.
  chromatic: { delay: 10000 }
}

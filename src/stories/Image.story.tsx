import { ImageStoryblok } from '../typings/generated/components-schema'
import { storyImage } from '../storybook/core/various'
import { LmImageElement } from '../components/image/ImageElement'

const props: ImageStoryblok = {
  _uid: '123',
  component: 'image',
  source:
    'https://a.storyblok.com/f/57008/5000x3334/bae4d23fcf/amsterdam-retouch.png'
}

const svg: ImageStoryblok = {
  ...props,
  source: 'https://a.storyblok.com/f/57008/x/7dea868beb/cc_icons-badge_029.svg'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Data Display/Image',
  component: LmImageElement
}

export const Basic = () => (
  <div
    style={{
      maxWidth: '500px',
      margin: '0 auto'
    }}
  >
    <h3>Default:</h3>
    <LmImageElement content={props} />
    <h3>Fixed width 150px</h3>
    <LmImageElement content={{ ...props, width: 150 }} />
    <h3>Rounded Circle 150px height:</h3>
    <LmImageElement
      content={
        {
          ...props,
          property: ['rounded-circle'],
          height: 150
        } as ImageStoryblok
      }
    />
    <h3>Square 150px height:</h3>
    <LmImageElement
      content={{ ...props, height: 150, property: ['square', 'rounded-0'] }}
    />
    <h3>Square 150px height rounded:</h3>
    <LmImageElement
      content={{ ...props, height: 150, property: ['square', 'rounded'] }}
    />
    <h3>Not Round:</h3>
    <LmImageElement content={{ ...props, property: ['rounded-0'] }} />
    <h3>Rounded:</h3>
    <LmImageElement content={{ ...props, property: ['rounded'] }} />
    <h3>Square:</h3>
    <LmImageElement
      content={{ ...props, height: 150, property: ['square', 'rounded'] }}
    />
    <h3>Resized images with fixed height or width:</h3>
    <LmImageElement content={{ ...props, width: 140 }} />
    <LmImageElement content={{ ...props, height: 64 }} />
    <LmImageElement
      content={{ ...props, property: ['rounded-circle'], width: 100 }}
    />
    <LmImageElement
      content={{ ...props, property: ['rounded-circle'], height: 64 }}
    />
    <LmImageElement content={{ ...props, property: ['square'], height: 64 }} />

    <LmImageElement content={{ ...props, property: ['rounded'], height: 64 }} />
  </div>
)

export const DefinedHeight = () => (
  <div style={{ backgroundColor: '#ccc' }}>
    <LmImageElement
      content={{
        ...props,
        source: '//a.storyblok.com/f/69069/112x180/3bb1b505d4/elements-2.png',
        height: 70
      }}
    />
    <LmImageElement
      content={{
        ...props,
        source: '//a.storyblok.com/f/69069/15x180/0c3a0ffb9e/elements-7.png',
        height: 70
      }}
    />
    <LmImageElement content={{ ...props, height: 100 }} />
    <LmImageElement content={{ ...props, width: 64 }} />
    <LmImageElement content={{ ...props, property: ['square'], height: 64 }} />
  </div>
)
export const ImageSVG = () => (
  <div
    style={{
      maxWidth: '500px',
      margin: '0 auto',
      overflow: 'hidden'
    }}
  >
    <LmImageElement content={{ ...svg, height: 64 }} />
    <LmImageElement content={{ ...svg, color: { rgba: '#ccc' }, height: 64 }} />
    <LmImageElement content={{ ...svg, color: { rgba: '#eee' }, height: 64 }} />
    <LmImageElement content={{ ...svg, color: { rgba: '#ccc' }, height: 64 }} />
  </div>
)
export const ImageFocalPoint = () => {
  const src =
    'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          height: '150px',
          overflow: 'hidden'
        }}
      >
        <LmImageElement
          content={storyImage({
            knob: 'Image width/height parent container',
            options: {
              source: src,
              focal_point: '50x0'
            }
          })}
        />
      </div>
      <br />
      <div
        style={{
          height: '150px',
          overflow: 'hidden'
        }}
      >
        <LmImageElement
          content={storyImage({
            knob: 'Same as 1. image different focal',
            options: {
              source: src,
              focal_point: '0x100'
            }
          })}
        />
      </div>
      <br />
      <div>
        <LmImageElement
          content={storyImage({
            knob: 'Image with height & width',
            options: {
              source: src,
              width: 500,
              height: 150,
              focal_point: '0x100'
            }
          })}
        />
      </div>
    </div>
  )
}

export const Playground = () => (
  <div
    style={{
      maxWidth: '500px',
      margin: '0 auto'
    }}
  >
    <LmImageElement content={storyImage()} />
  </div>
)

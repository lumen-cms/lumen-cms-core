import { ImageStoryblok } from '../../typings/generated/components-schema'
import { storyImage } from '../../storybook/core/various'
import LmImage from './Image'

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

export default {
  title: 'Design/Data Display/Image',
  component: LmImage
}

export const Basic = () => (
  <div
    style={{
      maxWidth: '500px',
      margin: '0 auto'
    }}
  >
    <h3>Default:</h3>
    <LmImage content={props} />
    <h3>Rounded Circle 150px height:</h3>
    <LmImage
      content={
        {
          ...props,
          property: ['rounded-circle'],
          height: 150
        } as ImageStoryblok
      }
    />
    <h3>Square 150px height:</h3>
    <LmImage
      content={{ ...props, height: 150, property: ['square', 'rounded-0'] }}
    />
    <h3>Square 150px height rounded:</h3>
    <LmImage
      content={{ ...props, height: 150, property: ['square', 'rounded'] }}
    />
    <h3>Not Round:</h3>
    <LmImage content={{ ...props, property: ['rounded-0'] }} />
    <h3>Rounded:</h3>
    <LmImage content={{ ...props, property: ['rounded'] }} />
    <h3>Thumbnail:</h3>
    <LmImage content={{ ...props, property: ['img-thumbnail'] }} />
    <h3>Circle Thumbnail:</h3>
    <LmImage
      content={{
        ...props,
        height: 150,
        property: ['rounded-circle', 'img-thumbnail']
      }}
    />
    <h3>Square:</h3>
    <LmImage
      content={{ ...props, height: 150, property: ['square', 'rounded'] }}
    />

    <h3>Resized images with fixed height or width:</h3>
    <LmImage content={{ ...props, width: 140 }} />
    <LmImage content={{ ...props, height: 64 }} />
    <LmImage content={{ ...props, property: ['rounded-circle'], width: 100 }} />
    <LmImage content={{ ...props, property: ['rounded-circle'], height: 64 }} />
    <LmImage content={{ ...props, property: ['square'], height: 64 }} />
    <LmImage content={{ ...props, property: ['img-thumbnail'], height: 64 }} />
    <LmImage content={{ ...props, property: ['rounded'], height: 64 }} />
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
    <LmImage content={{ ...svg, height: 64 }} />
    <LmImage content={{ ...svg, color: { rgba: '#ccc' }, height: 64 }} />
    <LmImage content={{ ...svg, color: { rgba: '#eee' }, height: 64 }} />
    <LmImage content={{ ...svg, color: { rgba: '#ccc' }, height: 64 }} />
    <div className="p-4">
      <h4>Playground:</h4>
      <LmImage
        content={storyImage({
          options: {
            source:
              'https://a.storyblok.com/f/57008/x/7dea868beb/cc_icons-badge_029.svg'
          }
        })}
      />
    </div>
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
        <LmImage
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
        <LmImage
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
        <LmImage
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
    <LmImage content={storyImage()} />
  </div>
)

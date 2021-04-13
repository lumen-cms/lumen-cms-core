import { LmComponentRender as Element } from '@LmComponentRender'
import { storyDialog } from '../../storybook/core/various'
import {
  ButtonStoryblok,
  DialogStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  IframeStoryblok,
  ImageStoryblok
} from '../../typings/generated/components-schema'

export default {
  title: 'Design/Feedback/Dialog'
}

const body = [
  {
    component: 'headline',
    _uid: 'dfasfsagafha',
    text: 'Some Dialog Headline'
  },
  {
    component: 'image',
    _uid: 'adfasfas',
    source: 'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
  }
] as (HeadlineStoryblok | ImageStoryblok)[]

export const Iframe = () => (
  <Element
    content={{
      component: 'dialog',
      _uid: 'dialog-register',
      fullscreen: 'xl',
      no_padding: true,
      body: [
        {
          component: 'iframe',
          _uid: 'iframex',
          full_height: true,
          url: `https://students-react-iframe-signup.now.sh?light=1`
        } as IframeStoryblok
      ],
      trigger: [
        {
          _uid: 'outline-checked',
          component: 'button',
          icon: {
            name: 'account-check-outline'
          },
          // @ts-ignore
          label: 'Signup',
          variant: 'fab',
          color: 'primary'
        } as ButtonStoryblok
      ]
    }}
  />
)

export const Playground = () => (
  <div
    style={{
      margin: '50px auto',
      width: '300px'
    }}
  >
    <Element
      content={
        {
          ...storyDialog({
            options: {
              title: 'Dialog Title'
            }
          }),
          body,
          trigger: [
            {
              component: 'button',
              _uid: 'adfasfasfasdfas',
              label: 'A button trigger'
            } as ButtonStoryblok
          ]
        } as DialogStoryblok
      }
    />
    <div style={{ padding: '10px' }} />
    <Element
      content={
        {
          ...storyDialog({
            options: {
              title: 'Dialog Title'
            }
          }),
          body,
          trigger: [
            {
              component: 'headline',
              _uid: 'sdfgsdg',
              text: 'Headline Trigger'
            } as HeadlineStoryblok
          ]
        } as DialogStoryblok
      }
    />
    <div style={{ padding: '10px' }} />
    <Element
      content={
        {
          ...storyDialog({
            count: 1,
            options: {
              title: 'Dialog Title'
            }
          }),
          body,
          trigger: [
            {
              component: 'image',
              _uid: 'sgsfdgsdfg',
              source:
                'https://a.storyblok.com/f/69529/4896x2755/95e0b03c15/img_9046.jpg'
            } as ImageStoryblok
          ]
        } as DialogStoryblok
      }
    />
    <div style={{ padding: '10px' }} />
    <Element
      content={
        {
          no_padding: true,
          slide_up: true,
          body,
          ...storyDialog({
            count: 4
          }),
          prevent_close_button: true,
          trigger: [
            {
              _uid: 'ghdhgdfh',
              component: 'icon',
              name: {
                name: 'home'
              },
              size: 'xxlarge',
              class_names: {
                values: ['text-danger']
              }
            } as IconStoryblok
          ]
        } as DialogStoryblok
      }
    />
  </div>
)

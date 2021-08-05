import { Story } from '@storybook/react'
import { storySnackbar } from '../../storybook/core/various'
import { ButtonStoryblok } from '../../typings/generated/components-schema'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import LmSnackbar from './Snackbar'
import { getComponentArgTypes } from '../../storybook/configControls'
import { findPresets } from '../../storybook/findStorybookPresets'
import { LmSnackbarProps } from './snackbarTypes'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Feedback/Snackbar',
  component: LmSnackbar,
  argTypes: {
    ...getComponentArgTypes('snackbar')
  }
}

export const Presets = () => (
  <StorybookPresetsContainer componentName="snackbar" />
)

const presetContent = findPresets<LmSnackbarProps['content']>('snackbar')

const Template: Story<LmSnackbarProps['content']> = (args) => (
  <div style={{ height: '150vh' }}>
    <LmSnackbar content={args} />
  </div>
)

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent[2]
}

export const HideOnScroll = Template.bind({})
HideOnScroll.args = {
  ...presetContent[1],
  display: 'hide_on_scroll'
}

export const ShowOnScroll = Template.bind({})
ShowOnScroll.args = {
  ...presetContent[2],
  display: 'show_on_scroll'
}

export const Autohide = Template.bind({})
Autohide.args = {
  ...presetContent[1],
  auto_show: 0,
  auto_close: 4000
}

export const Autoshow = Template.bind({})
Autoshow.args = {
  ...presetContent[1],
  auto_show: 4000
}

export const Dialog = () => (
  <>
    <h3>You can also use a dialog!</h3>
    <LmSnackbar
      content={{
        ...storySnackbar(),
        dialog: true,
        descriptions: [
          {
            component: 'headline',
            _uid: '123',
            text: 'Hello Dialog'
          }
        ],
        close_action: [
          {
            component: 'button',
            _uid: '3qewqeq',
            icon: {
              name: 'close'
            }
          } as ButtonStoryblok
        ]
      }}
    />
  </>
)

export const Playground = () => (
  <LmSnackbar
    content={{
      ...storySnackbar(),
      descriptions: [
        {
          component: 'headline',
          _uid: '123',
          text: 'Hello Snackbar'
        }
      ],
      close_action: [
        {
          component: 'button',
          _uid: '3qewqeq',
          icon: {
            name: 'close'
          }
        } as ButtonStoryblok
      ]
    }}
  />
)

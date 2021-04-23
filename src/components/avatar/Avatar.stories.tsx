import React from 'react'
import { Meta, Story } from '@storybook/react'
import { getComponentArgTypes } from '../../storybook/configControls'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import { LmAvatarProps } from './avatarTypes'
import {
  findFirstPreset,
  findPresets
} from '../../storybook/findStorybookPresets'
import { LmAvatar } from './LmAvatar'
import StorybookSpacingContainer from '../../storybook/components/StorybookSpacingContainer'

export default {
  title: 'Design/Data Display/Avatar',
  component: LmAvatar,
  argTypes: {
    ...getComponentArgTypes('avatar')
  }
} as Meta

export const Presets = () => (
  <StorybookPresetsContainer componentName="avatar" />
)
Presets.parameters = {
  controls: false
}

const Template: Story<LmAvatarProps['content']> = (args) => (
  <LmAvatar content={args} />
)

const presetContent = findFirstPreset<LmAvatarProps['content']>('avatar')
const secondPreset = findPresets<LmAvatarProps['content']>('avatar')[1]

export const WithIcon = Template.bind({})
WithIcon.args = {
  ...presetContent
}

export const WithImage = Template.bind({})
WithImage.args = {
  ...secondPreset
}

export const Sizes = () => (
  <StorybookSpacingContainer>
    <LmAvatar content={{ ...presetContent, size: 'dense' }} />
    <LmAvatar content={{ ...presetContent }} />
    <LmAvatar content={{ ...presetContent, size: 'large' }} />
    <LmAvatar content={{ ...presetContent, size: 'xlarge' }} />
    <LmAvatar content={{ ...presetContent, custom_size: 120 }} />
  </StorybookSpacingContainer>
)

export const Shapes = () => (
  <StorybookSpacingContainer>
    <LmAvatar content={{ ...presetContent }} />
    <LmAvatar content={{ ...presetContent, variant: 'rounded' }} />
    <LmAvatar content={{ ...presetContent, variant: 'square' }} />
  </StorybookSpacingContainer>
)

export const Colors = () => (
  <StorybookSpacingContainer>
    <LmAvatar content={{ ...presetContent, color: { rgba: 'black' } }} />
    <LmAvatar
      content={{
        ...presetContent,
        color: { rgba: 'white' },
        background_color: { rgba: 'black' }
      }}
    />
    <LmAvatar
      content={{
        ...presetContent,
        variant: 'rounded',
        color: { rgba: 'white' },
        background_color: { rgba: 'black' }
      }}
    />
    <LmAvatar
      content={{
        ...presetContent,
        variant: 'square',
        color: { rgba: 'white' },
        background_color: { rgba: 'black' }
      }}
    />
  </StorybookSpacingContainer>
)

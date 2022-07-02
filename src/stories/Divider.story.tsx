import { Meta, Story } from '@storybook/react'
import { getComponentArgTypes } from '../storybook/configControls'
import StorybookPresetsContainer from '../storybook/components/StorybookPresetsContainer'
import { findFirstPreset, findPresets } from '../storybook/findStorybookPresets'
import { LmDividerProps } from '../components/divider/dividerTypes'
import { LmDivider } from '../components/divider/Divider'
import {
  HeadlineStoryblok,
  ImageStoryblok
} from '../typings/generated/components-schema'

const COMPONENT_NAME = 'divider'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Data Display/Divider',
  component: LmDivider,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
} as Meta

export const Presets = () => (
  <StorybookPresetsContainer componentName={COMPONENT_NAME} />
)

const Template: Story<LmDividerProps['content']> = (args) => (
  <LmDivider content={args} />
)

const presetContent = findFirstPreset<LmDividerProps['content']>(COMPONENT_NAME)
const secondPreset = findPresets<LmDividerProps['content']>(COMPONENT_NAME)[1]

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  ...secondPreset
}

export const Examples = () => (
  <>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          size: 24,
          width: 70
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          size: 24,
          width: 70,
          thickness: 5
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: { name: 'chevron_down' },
          size: 24,
          width: 70
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: { name: 'chevron_down' },
          size: 24,
          width: 70,
          thickness: 5
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: { name: 'chevron_down' },
          size: 30
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: {
            name: 'chevron_down'
          },
          count: 3,
          color: {
            rgba: 'rgba(121,121,121,1)'
          },
          size: 40,
          width: 15
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: {
            name: 'chevron_down'
          },
          color: {
            rgba: 'rgba(121,121,121,1)'
          },
          size: 50,
          width: 30
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: {
            name: 'chevron_down'
          },
          color: {
            rgba: 'rgba(22,22,1212,1)'
          },
          size: 60,
          width: 30
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: {
            name: 'chevron_down'
          },
          color: {
            rgba: 'rgba(22,333,1212,1)'
          },
          size: 79,
          width: 30
        }}
      />
    </div>
    <div>
      <LmDivider
        content={{
          ...presetContent,
          icon: {
            name: 'chevron_down'
          },
          color: {
            rgba: 'rgba(22,333,1212,1)'
          },
          size: 79,
          width: 30,
          thickness: 8
        }}
      />
    </div>
    <div style={{ height: '50px' }}>
      <LmDivider
        content={{
          ...presetContent,
          orientation: 'vertical'
        }}
      />
    </div>
  </>
)

export const ExampleWithText = Template.bind({})
ExampleWithText.args = {
  body: [
    {
      _uid: '123123',
      component: 'headline',
      text: 'Hello'
    } as HeadlineStoryblok
  ]
}

export const ExampleWithImage = Template.bind({})
ExampleWithImage.args = {
  alignment: 'left',
  body: [
    {
      _uid: '123123',
      component: 'image',
      source:
        'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/airbnb.svg'
    } as ImageStoryblok
  ]
}

export const ExampleVertical = Template.bind({})
ExampleVertical.args = {
  orientation: 'vertical'
}

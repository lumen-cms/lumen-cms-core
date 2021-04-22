import { Meta, Story } from '@storybook/react'
import { getComponentArgTypes } from '../../storybook/configControls'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import {
  findFirstPreset,
  findPresets
} from '../../storybook/findStorybookPresets'
import { LmDividerProps } from './dividerTypes'
import { LmDivider } from './Divider'

const COMPONENT_NAME = 'divider'

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
  </>
)

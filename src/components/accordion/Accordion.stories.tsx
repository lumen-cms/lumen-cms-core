import { LmComponentRender } from '@LmComponentRender'
import { Meta, Story } from '@storybook/react'
import {
  storyAccordion,
  storyAccordionItem
} from '../../storybook/core/various'
import { get3ColumnsSection } from '../../storybook/section'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import LmAccordion from './Accordion'
import { LmAccordionProps } from './accordionTypes'
import { findPresets } from '../../storybook/findStorybookPresets'

const genericArgTypes = {
  component: {
    control: false
  },
  _uid: {
    control: false
  }
} as Meta['argTypes']

export default {
  title: 'Design/Surfaces/Accordion',
  component: LmAccordion,
  argTypes: {
    ...genericArgTypes
  }
} as Meta

export const Presets = () => (
  <StorybookPresetsContainer componentName="accordion" />
)

const Template: Story<LmAccordionProps> = (args) => (
  <LmAccordion content={args as any} />
)

const presetContent = findPresets('accordion')[0].preset
export const WithControls = Template.bind({})
WithControls.args = {
  ...(presetContent as any)
}

export const Playground = () => {
  return (
    <LmComponentRender
      content={{
        ...storyAccordion(),
        body: [
          {
            ...storyAccordionItem({ count: 1 }),
            body: [get3ColumnsSection({ count: 1, knob: 'Column Content' })]
          },
          {
            ...storyAccordionItem({ count: 2 }),
            body: [get3ColumnsSection({ count: 2, knob: 'Column Content' })]
          }
        ]
      }}
    />
  )
}

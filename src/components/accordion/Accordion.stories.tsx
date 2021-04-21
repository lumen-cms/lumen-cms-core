import { Meta, Story } from '@storybook/react'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import LmAccordion from './Accordion'
import { LmAccordionProps } from './accordionTypes'
import { findFirstPreset } from '../../storybook/findStorybookPresets'
import { genericArgTypes } from '../../storybook/configControls'

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

const Template: Story<LmAccordionProps['content']> = (args) => (
  <LmAccordion content={args} />
)

const presetContent = findFirstPreset<LmAccordionProps['content']>('accordion')

export const Base = Template.bind({})
Base.args = {
  ...presetContent
}

export const Square = Template.bind({})
Square.args = {
  ...Base.args,
  square: true
}
export const Plus = Template.bind({})
Plus.args = {
  ...Base.args,
  use_plus: true
}
export const RestrictOne = Template.bind({})
RestrictOne.args = {
  ...Base.args,
  restrict_one: true
}

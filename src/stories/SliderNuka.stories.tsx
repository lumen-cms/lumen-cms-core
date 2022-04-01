import { Story } from '@storybook/react'
import { LmSliderProps } from '../components/slider/sliderTypes'
import { findFirstPreset } from '../storybook/findStorybookPresets'
import { getComponentArgTypes } from '../storybook/configControls'
import LmNukaCarousel from '../components/slider/LmNukaCarousel'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Surfaces/NukaSlider',
  component: LmNukaCarousel,
  argTypes: {
    ...getComponentArgTypes('slider')
  }
}

const Template: Story<LmSliderProps['content']> = (args) => (
  <LmNukaCarousel content={args} />
)

const presetContent = findFirstPreset<LmSliderProps['content']>('slider')

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

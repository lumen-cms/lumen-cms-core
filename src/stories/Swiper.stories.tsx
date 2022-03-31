import LmSwiper from '../components/slider/LmSwiper'
import { Story } from '@storybook/react'
import { LmSliderProps } from '../components/slider/sliderTypes'
import { findFirstPreset } from '../storybook/findStorybookPresets'
import { getComponentArgTypes } from '../storybook/configControls'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Surfaces/Swiper',
  component: LmSwiper,
  argTypes: {
    ...getComponentArgTypes('slider')
  }
}

const Template: Story<LmSliderProps['content']> = (args) => (
  <LmSwiper content={args} />
)

const presetContent = findFirstPreset<LmSliderProps['content']>('slider')

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

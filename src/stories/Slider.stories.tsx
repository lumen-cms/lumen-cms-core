import { Story } from '@storybook/react'
import { get3ColumnsSection } from '../storybook/section'
import StorybookPresetsContainer from '../storybook/components/StorybookPresetsContainer'
import LmSlider from '../components/slider/Slider'
import { getComponentArgTypes } from '../storybook/configControls'
import { findFirstPreset } from '../storybook/findStorybookPresets'
import { LmSliderProps } from '../components/slider/sliderTypes'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Surfaces/Carousel',
  component: LmSlider,
  argTypes: {
    ...getComponentArgTypes('slider')
  }
}

export const Presets = () => (
  <StorybookPresetsContainer componentName="slider" />
)

const presetContent = findFirstPreset<LmSliderProps['content']>('slider')

const Template: Story<LmSliderProps['content']> = (args) => (
  <LmSlider content={args} />
)

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}

export const NavigationBelow = Template.bind({})
NavigationBelow.args = {
  ...presetContent,
  property: [
    'arrows_beside_pagination',
    'arrows_dark',
    'pagination_below_content'
  ]
}

export const Autoslide = Template.bind({})
Autoslide.args = {
  ...presetContent,
  autoslide: 5000
}

export const Light = Template.bind({})
Light.args = {
  ...presetContent,
  property: ['arrows_dark'],
  body: [
    get3ColumnsSection({ count: 1 }),
    get3ColumnsSection({ count: 2 }),
    get3ColumnsSection({ count: 3 })
  ]
}

export const Dark = Template.bind({})
Dark.args = {
  ...presetContent,
  section_variant: 'dark',
  body: [
    get3ColumnsSection({ count: 1 }),
    get3ColumnsSection({ count: 2 }),
    get3ColumnsSection({ count: 3 })
  ]
}

export const DarkBelow = Template.bind({})
DarkBelow.args = {
  ...presetContent,
  section_variant: 'dark',
  property: [
    'pagination_below_content',
    'pagination_dark',
    'arrows_beside_pagination'
  ],
  body: [
    get3ColumnsSection({ count: 1 }),
    get3ColumnsSection({ count: 2 }),
    get3ColumnsSection({ count: 3 })
  ]
}

import LmPlayer from '../components/player/Player'
import { Meta, Story } from '@storybook/react'
import { getComponentArgTypes } from '../storybook/configControls'
import { LmPlayerProps } from '../components/player/playerTypes'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Data Display/Player',
  component: LmPlayer,
  argTypes: {
    ...getComponentArgTypes('player')
  }
} as Meta

const Template: Story<LmPlayerProps['content']> = (args) => (
  <LmPlayer content={args} />
)
const testUrl = 'https://www.youtube.com/watch?v=ysz5S6PUM-U'

export const Basic = Template.bind({})
Basic.args = {
  url: testUrl,
  disable_lazy_load: true
}

export const Basic16x9 = Template.bind({})
Basic16x9.args = {
  url: testUrl,
  disable_lazy_load: true,
  ratio: '16x9'
}

export const Basic1x1 = Template.bind({})
Basic1x1.args = {
  url: testUrl,
  disable_lazy_load: true,
  ratio: '1x1'
}

const url =
  'https://a.storyblok.com/f/106061/x/12626f9fdd/the-game-marketer-homepage-header.mp4'

export const InternalUrl = Template.bind({})
InternalUrl.args = {
  // @ts-ignore
  url_internal: { filename: url },
  disable_lazy_load: true
}

export const InternalUrl16x9 = Template.bind({})
InternalUrl16x9.args = {
  // @ts-ignore
  url_internal: { filename: url },
  disable_lazy_load: true,
  ratio: '16x9'
}

export const InternalUrl1x1 = Template.bind({})
InternalUrl1x1.args = {
  // @ts-ignore
  url_internal: { filename: url },
  disable_lazy_load: true,
  ratio: '1x1'
}

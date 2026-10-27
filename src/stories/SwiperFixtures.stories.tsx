import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import LmSwiper from '../components/slider/LmSwiper'
import type { SwiperStoryblok } from '../typings/generated/components-schema'

const content: SwiperStoryblok = {
  _uid: 'swiper-regression',
  component: 'swiper',
  height: 300,
  theme_color: 'primary.main',
  body: ['#c8e6c9', '#bbdefb', '#ffe0b2', '#e1bee7', '#b2dfdb'].map(
    (color, index) => ({
      _uid: `slide-${index}`,
      component: 'swiper_item',
      body: [
        {
          _uid: `content-${index}`,
          component: 'html',
          body: `<div style="height:100%;min-height:300px;display:flex;align-items:center;justify-content:center;background:${color};font:600 28px sans-serif;color:#18364c">Slide ${
            index + 1
          }</div>`
        }
      ]
    })
  )
}

const meta: Meta<typeof LmSwiper> = {
  title: 'Design/Surfaces/Swiper Fixtures',
  component: LmSwiper,
  args: { content },
  decorators: [
    (Story) => (
      <div style={{ padding: 32 }}>
        <Story />
      </div>
    )
  ]
}
export default meta

type Story = StoryObj<typeof meta>
export const Navigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const next = await canvas.findByRole('button', { name: 'Next slide' })
    await userEvent.click(next)
    await waitFor(() =>
      expect(
        canvasElement.querySelector('.swiper-slide-active')
      ).toHaveTextContent('Slide 2')
    )
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Go to slide 4' })
    )
    await waitFor(() =>
      expect(
        canvasElement.querySelector('.swiper-slide-active')
      ).toHaveTextContent('Slide 4')
    )
  }
}
export const Responsive: Story = {
  args: {
    content: {
      ...content,
      slides_per_view: '1,2,3',
      space_between_slides: '8,16,24'
    }
  }
}
export const Autoplay: Story = {
  args: {
    content: { ...content, autoslide_duration: 1000, pause_on_hover: true }
  }
}
export const Fade: Story = { args: { content: { ...content, effect: 'fade' } } }
export const Coverflow: Story = {
  args: { content: { ...content, height: undefined, effect: 'coverflow' } }
}
export const Cube: Story = { args: { content: { ...content, effect: 'cube' } } }
export const Flip: Story = { args: { content: { ...content, effect: 'flip' } } }
export const Cards: Story = {
  args: { content: { ...content, height: undefined, effect: 'cards' } }
}
export const Creative: Story = {
  args: { content: { ...content, effect: 'creative' } }
}
export const HiddenControls: Story = {
  args: {
    content: { ...content, property: ['hide_arrows', 'hide_pagination'] }
  }
}

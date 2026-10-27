import { Meta, StoryFn } from '@storybook/react'
import StorybookPresetsContainer from '../storybook/components/StorybookPresetsContainer'
import LmAccordion from '../components/accordion/Accordion'
import { LmAccordionProps } from '../components/accordion/accordionTypes'
import { findFirstPreset } from '../storybook/findStorybookPresets'
import { getComponentArgTypes } from '../storybook/configControls'
import { expect, within } from 'storybook/test'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Surfaces/Accordion',
  component: LmAccordion,
  argTypes: {
    ...getComponentArgTypes('accordion')
  }
} as Meta

export const Presets = () => (
  <StorybookPresetsContainer componentName="accordion" />
)

const Template: StoryFn<LmAccordionProps['content']> = (args) => (
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

export const WrappedCustomTitle = {
  render: () => (
    <div style={{ width: 280, textAlign: 'center' }}>
      <LmAccordion
        content={{
          _uid: 'narrow-course',
          component: 'accordion',
          body: [
            {
              _uid: 'credits',
              component: 'accordion_item',
              title_custom: [
                {
                  _uid: 'credits-title',
                  component: 'headline',
                  text: 'International Credit Transfer Info',
                  typography: 'body1',
                  font_size: '24px',
                  line_height: '32px'
                }
              ]
            }
          ]
        }}
      />
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const title = await within(canvasElement).findByText(
      'International Credit Transfer Info'
    )
    await expect(title.getBoundingClientRect().height).toBeGreaterThan(32)
    await expect(getComputedStyle(title).textAlign).toBe('center')
  }
}

export const WrappedPlainTitles = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {(['start', 'center', 'right'] as const).map((textAlign) => (
        <div key={textAlign} style={{ width: 280, textAlign }}>
          <LmAccordion
            content={{
              _uid: `faq-${textAlign}`,
              component: 'accordion',
              body: [
                {
                  _uid: `question-${textAlign}`,
                  component: 'accordion_item',
                  title: `${textAlign}: Wie lade ich Mitglieder zu meinem Club ein?`
                }
              ]
            }}
          />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    for (const alignment of ['start', 'center', 'right']) {
      const title = await within(canvasElement).findByText(
        `${alignment}: Wie lade ich Mitglieder zu meinem Club ein?`
      )
      await expect(title.getBoundingClientRect().height).toBeGreaterThan(24)
      await expect(getComputedStyle(title).textAlign).toBe(alignment)
    }
  }
}

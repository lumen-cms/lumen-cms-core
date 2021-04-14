import { LmComponentRender } from '@LmComponentRender'
import { Meta, Story } from '@storybook/react'
import {
  storyAccordion,
  storyAccordionItem
} from '../../storybook/core/various'
import { get3ColumnsSection } from '../../storybook/section'
import LmAccordion from './Accordion'
import { LmAccordionProps } from './accordionTypes'

export default {
  title: 'Design/Surfaces/Accordion',
  component: LmAccordion
} as Meta

const Template: Story<LmAccordionProps> = (args) => <LmAccordion {...args} />

const blok = {
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
}

export const Basic = Template.bind({})
Basic.args = {
  content: {
    _uid: '2342',
    component: 'accordion',
    body: [
      {
        _uid: '3123',
        component: 'accordion_item',
        title: 'Test',
        body: [
          {
            _uid: '23123',
            component: 'headline',
            text: 'some test'
          }
        ]
      }
    ]
  }
}

export const Playground = () => {
  return <LmComponentRender content={blok} />
}

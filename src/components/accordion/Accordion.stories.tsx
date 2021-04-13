import { LmComponentRender } from '@LmComponentRender'
import {
  storyAccordion,
  storyAccordionItem
} from '../../storybook/core/various'
import { get3ColumnsSection } from '../../storybook/section'

export default {
  title: 'Design/Surfaces/Accordion'
}

export const Playground = () => {
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

  return <LmComponentRender content={blok} />
}

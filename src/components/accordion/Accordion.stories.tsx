import { LmComponentRender } from '@LmComponentRender'
import {
  storyAccordion,
  storyAccordionItem
} from '../../storybook/core/various'
import { get3ColumnsSection } from '../../storybook/section'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'

export default {
  title: 'Design/Surfaces/Accordion'
}

export const Presets = () => (
  <StorybookPresetsContainer componentName="accordion" />
)

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

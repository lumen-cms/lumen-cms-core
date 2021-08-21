import LmEvent from './Event'
import { getComponentArgTypes } from '../../storybook/configControls'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'

const COMPONENT_NAME = 'event'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Content/Event',
  component: LmEvent,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
}

export const Preset = () => (
  <StorybookPresetsContainer componentName={COMPONENT_NAME} />
)

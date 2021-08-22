import { getComponentArgTypes } from '../../storybook/configControls'
import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import LmEventCalendar from './EventCalendar'

const COMPONENT_NAME = 'event_calendar'
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Content/Event Calendar',
  component: LmEventCalendar,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
}

export const Preset = () => (
  <StorybookPresetsContainer componentName={COMPONENT_NAME} />
)

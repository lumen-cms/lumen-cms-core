import LmCardStandalone from '../components/card/CardStandalone'
import { getComponentArgTypes } from '../storybook/configControls'
import StorybookPresetsContainer from '../storybook/components/StorybookPresetsContainer'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Surfaces/Card',
  component: LmCardStandalone,
  argTypes: {
    ...getComponentArgTypes('card')
  }
}

export const Presets = () => <StorybookPresetsContainer componentName="card" />

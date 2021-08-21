import StorybookPresetsContainer from '../../storybook/components/StorybookPresetsContainer'
import { getComponentArgTypes } from '../../storybook/configControls'
import LmNews from './News'

let COMPONENT_NAME = 'news'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Content/News',
  component: LmNews,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
}

export const Presets = () => {
  return <StorybookPresetsContainer componentName={COMPONENT_NAME} />
}

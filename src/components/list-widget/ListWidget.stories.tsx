import { Meta, Story } from '@storybook/react'
import { AppContextProps } from '@context/AppContext'
import { LmListWidgetProps } from './listWidgetTypes'
import { findPresets } from '../../storybook/findStorybookPresets'
import LmListWidget from './ListWidget'
import { getComponentArgTypes } from '../../storybook/configControls'
import { fetchStoryblokContent } from '../../storybook/fetchStoryblokContent'
import AppProvider from '../provider/AppProvider'
import { listWidgetFilter } from '../../utils/initial-props/traversePageContent'

const COMPONENT_NAME = 'list_widget'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Data Display/List Widget',
  component: LmListWidget,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  },
  // decorators: [SetStoriesDecorator],
  loaders: [
    async () => {
      const storyblokContent = await fetchStoryblokContent()
      return {
        storyblokContent
      }
    }
  ]
} as Meta

const presets = findPresets<LmListWidgetProps['content']>(COMPONENT_NAME)

const Template: Story<LmListWidgetProps['content']> = (
  args,
  { loaded: { storyblokContent } }
) => {
  const listWidgetData = {}
  presets.forEach((preset) => {
    listWidgetData[preset._uid] = listWidgetFilter(
      preset,
      storyblokContent.stories
    )
  })
  return (
    <AppProvider content={{ listWidgetData } as AppContextProps}>
      {' '}
      <LmListWidget content={args} />
    </AppProvider>
  )
}
//
export const Basic = Template.bind({})
Basic.args = {
  ...presets[0]
}

export const Variant_1 = Template.bind({})
Variant_1.args = {
  ...presets[1]
}

export const Variant_2 = Template.bind({})
Variant_2.args = {
  ...presets[2]
}

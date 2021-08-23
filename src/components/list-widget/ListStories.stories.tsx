import { getComponentArgTypes } from '../../storybook/configControls'
import { Story } from '@storybook/react'
import { LmListStoriesProps } from './listWidgetTypes'
import LmListStories from './ListStories'
import { findFirstPreset } from '../../storybook/findStorybookPresets'
import { CONFIG } from '@CONFIG'
import { listStoriesData } from '../../utils/initial-props/component-data/listStoriesData'

const COMPONENT_NAME = 'list_stories'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Content/List Stories',
  component: LmListStories,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  },
  loaders: [
    // @ts-ignore
    async ({ args }) => {
      CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
      CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
      CONFIG.rootDirectory = ''
      console.log(args)
      const data = await listStoriesData(args, {
        locale: 'en',
        defaultLocale: 'en'
      })
      return {
        list_stories_data: data
      }
    }
  ]
}

const Template: Story<LmListStoriesProps['content']> = (
  args,
  { loaded: { list_stories_data } }
) => <LmListStories content={{ ...args, list_stories_data }} />

const presetContent =
  findFirstPreset<LmListStoriesProps['content']>(COMPONENT_NAME)

export const AllStories = Template.bind({})
AllStories.args = {
  ...presetContent
}

export const News = Template.bind({})
News.args = {
  ...presetContent,
  view_types: ['news']
}

export const Events = Template.bind({})
Events.args = {
  ...presetContent,
  view_types: ['event']
}

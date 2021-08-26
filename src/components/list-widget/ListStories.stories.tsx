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
      return {
        list_stories_data: await listStoriesData(args, {
          locale: 'en',
          defaultLocale: 'en'
        })
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

export const MaxItems = Template.bind({})
MaxItems.args = {
  ...presetContent,
  max_items: 5
}

export const CustomPagination = Template.bind({})
CustomPagination.args = {
  ...presetContent,
  pagination: [
    {
      component: 'pagination',
      _uid: 'pagination',
      items_per_page: 5,
      size: 'large',
      color: 'secondary',
      shape: 'rounded'
    }
  ]
}

export const News = Template.bind({})
News.args = {
  ...presetContent,
  layout: [
    {
      component: 'news_list',
      _uid: 'news_list',
      read_more_label: [
        {
          component: 'headline',
          _uid: 'headline',
          text: 'Read more...',
          typography: 'caption'
        }
      ]
    }
  ],
  view_types: ['news']
}

export const Events = Template.bind({})
Events.args = {
  ...presetContent,
  view_types: ['event']
}

export const ListsView = Template.bind({})
ListsView.args = {
  ...presetContent,
  layout: [
    {
      component: 'lists',
      _uid: 'lists'
    }
  ],
  view_types: ['news']
}

export const NavListView = Template.bind({})
NavListView.args = {
  ...presetContent,
  layout: [
    {
      component: 'nav_list',
      _uid: 'nav_list',
      properties: ['flex-column']
    }
  ],
  view_types: ['news']
}
export const CardListView = Template.bind({})
CardListView.args = {
  ...presetContent,
  layout: [
    {
      component: 'card_list',
      _uid: 'card_list'
    }
  ],
  view_types: ['news']
}

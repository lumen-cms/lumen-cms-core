import { LmComponentRender as LmListWidget } from '../src/'
import * as React from 'react'
import { ListsStoryblok, ListWidgetStoryblok, NavListStoryblok } from '../src/typings/generated/components-schema'
import SetStoriesDecorator from '../src/storybook/components/SetStoriesDecorator'
import { storyCardList, storyListWidget } from '../src/storybook/core/section'

const props: ListWidgetStoryblok = {
  _uid: 'storyblok_list',
  component: 'list_widget',
  maximum_items: 4
}

const filtered: ListWidgetStoryblok = {
  _uid: 'storyblok_list',
  component: 'list_widget',
  maximum_items: 10,
  tags: {
    values: ['testimonial']
  }
}

const listsOption: ListsStoryblok = {
  component: 'lists',
  _uid: 'storyblok_lists'
}

const linksOption: NavListStoryblok = {
  component: 'nav_list',
  _uid: 'storyblok_navlist',
  properties: ['flex-column']
}

export default {
  title: 'List Widget',
  decorators: [SetStoriesDecorator]
}

export const Basic = () => (
  <div className="p-3">
    <h2>Limit is set to 4:</h2>
    <h4>Default:</h4>
    <LmListWidget content={props} />
    <h4>List type:</h4>
    <LmListWidget content={{ ...props, list_options: [listsOption] }} />
    <h4>Links type:</h4>
    <LmListWidget content={{ ...props, list_options: [linksOption] }} />
  </div>
)
export const Filtered = () => (
  <div className="p-3">
    <h2>Limit is set to 10:</h2>
    <h4>Default:</h4>
    <LmListWidget content={filtered} />
    <h4>List type:</h4>
    <LmListWidget content={{ ...filtered, list_options: [listsOption] }} />
    <h4>Links type:</h4>
    <LmListWidget content={{ ...filtered, list_options: [linksOption] }} />
  </div>
)
export const Playground = () => {
  const listOpts = storyListWidget({
    options: {
      tags: {
        values: ['testimonial']
      },
      maximum_items: 10,
      list_options: [storyCardList()]
    }
  })

  return (
    <div className="p-5">
      <LmListWidget content={{ ...listOpts }} />
    </div>
  )
}


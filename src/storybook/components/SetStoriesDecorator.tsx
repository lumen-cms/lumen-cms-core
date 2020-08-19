import * as React from 'react'
import { useEffect, useState } from 'react'
import StoryblokService from '../../utils/StoryblokService'
import AppProvider from '../../components/provider/AppProvider'
import { AppContextProps } from '../../components/provider/context/AppContext'
import { createGlobalState } from 'react-hooks-global-state'
import { LmComponentRender } from '../../index'
import { Story } from '@storybook/react/types-6-0'

interface StorybookState {
  allTags: { value: string, label: string }[]
}

const storybookDefault: StorybookState = {
  allTags: []
}
export const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState(storybookDefault)


const SetStoriesDecorator = (Story: Story) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [values, setValues] = useState<AppContextProps>()
  const [, setAllTags] = useGlobalState('allTags')
  useEffect(
    () => {
      const fetch = async () => {
        let [categories, stories, tags] = await Promise.all([
          StoryblokService.getAll('cdn/stories', {
            per_page: 100,
            sort_by: 'content.name:asc',
            filter_query: {
              'component': {
                'in': 'category'
              }
            }
          }),
          StoryblokService.getAll(`cdn/stories`, {
            per_page: 100,
            excluding_fields: 'body,meta_robots,property,meta_title,meta_description,seo_body',
            sort_by: 'published_at:desc',
            filter_query: {
              'component': {
                'in': 'page'
              }
            }
          }),
          StoryblokService.get('cdn/tags')
        ])
        const tagList = (tags && tags.data.tags && tags.data.tags.map((item: { name: string, taggings_count: number }) => ({
          value: item.name,
          label: `${item.name} (${item.taggings_count})`
        }))) || []
        setAllTags(tagList)
        setLoaded(true)
        setValues({
          listWidgetData: {
            'storyblok_list': stories
          },
          allCategories: categories,
          allStaticContent: []
        })
      }

      fetch()
    },
    [setAllTags]
  )
  if (loaded && values) {
    return (
      <AppProvider content={{ ...values, ComponentRender: LmComponentRender as any }}>
        <div className="p-3">
          <Story />
        </div>
      </AppProvider>
    )
  } else {
    return (
      <div>loading...</div>
    )
  }
}
export default SetStoriesDecorator

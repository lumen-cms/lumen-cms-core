import * as React from 'react'
import { useEffect, useState } from 'react'
import { createGlobalState } from 'react-hooks-global-state'
import { Story as StoryType } from '@storybook/react/types-6-0.d'
import { AppContextProps } from '@context/AppContext'
import { LmComponentRender } from '@LmComponentRender'
import AppProvider from '../../components/provider/AppProvider'

interface StorybookState {
  allTags: { value: string; label: string }[]
}

const storybookDefault: StorybookState = {
  allTags: []
}
export const {
  setGlobalState,
  useGlobalState,
  getGlobalState
} = createGlobalState(storybookDefault)

const SetStoriesDecorator = (Story: StoryType) => {
  // @ts-ignore
  const [loaded, setLoaded] = useState<boolean>(false)
  // @ts-ignore
  const [values, setValues] = useState<AppContextProps>()
  const [, setAllTags] = useGlobalState('allTags')
  useEffect(() => {
    const fetch = async () => {
      // const [categories, stories, tags] = await Promise.all([
      // TODO
      // LmStoryblokService.getAll('cdn/stories', {
      //   per_page: 100,
      //   sort_by: 'content.name:asc',
      //   filter_query: {
      //     component: {
      //       in: 'category'
      //     }
      //   }
      // }),
      // LmStoryblokService.getAll(`cdn/stories`, {
      //   per_page: 100,
      //   excluding_fields:
      //     'body,meta_robots,property,meta_title,meta_description,seo_body',
      //   sort_by: 'published_at:desc',
      //   filter_query: {
      //     component: {
      //       in: 'page'
      //     }
      //   }
      // }),
      // ])
      // const tagList = []
      // (tags &&
      //   tags.data?.tags &&
      //   tags.data?.tags.map(
      //     (item: { name: string; taggings_count: number }) => ({
      //       value: item.name,
      //       label: `${item.name} (${item.taggings_count})`
      //     })
      //   )) ||
      // []
      // const stories = []
      // const categories = []
      // setAllTags(tagList)
      // setLoaded(true)
      // setValues({
      //   listWidgetData: {
      //     storyblok_list: stories
      //   },
      //   allCategories: categories,
      //   allStaticContent: []
      // })
    }

    fetch()
  }, [setAllTags])
  if (loaded && values) {
    return (
      <AppProvider
        content={{ ...values, ComponentRender: LmComponentRender as any }}
      >
        <div className="p-3">
          <Story />
        </div>
      </AppProvider>
    )
  }
  return <div>loading...</div>
}
export default SetStoriesDecorator

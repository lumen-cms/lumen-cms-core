import { getComponentArgTypes } from '../../storybook/configControls'
import LmNewsList from './NewsList'
import { Story } from '@storybook/react'
import { NewsListProps } from './newsTypes'
import { findFirstPreset } from '../../storybook/findStorybookPresets'
import { getNewsData } from '../../utils/initial-props/component-data/newsData'
import { CONFIG } from '@CONFIG'

let COMPONENT_NAME = 'news_list'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Content/News List',
  component: LmNewsList,
  argTypes: {
    ...getComponentArgTypes(COMPONENT_NAME)
  }
}

const Template: Story<NewsListProps['content']> = (
  args,
  { loaded: { news_list_data } }
) => <LmNewsList content={{ ...args, news_list_data }} />

const presetContent = findFirstPreset<NewsListProps['content']>(COMPONENT_NAME)

export const Basic = Template.bind({})
Basic.args = {
  ...presetContent
}
// @ts-ignore
Basic.loaders = [
  async () => {
    CONFIG.previewToken = 'irBTkf8Yqq6UJvRRQH8Bmwtt'
    CONFIG.publicToken = 'HvyhDYHDPgo3U4lB7s44jgtt'
    CONFIG.rootDirectory = ''
    const data = await getNewsData(presetContent, {
      locale: 'en',
      defaultLocale: 'en'
    })
    return {
      news_list_data: data
    }
  }
]

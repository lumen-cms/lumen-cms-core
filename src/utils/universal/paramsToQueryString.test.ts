import { queryStringify } from './paramsToQueryString'
import { StoriesParams } from 'storyblok-js-client'
import { stringify } from 'qs'
import { fetchListStories } from '../../components/list-widget/listUtils/fetchListStories'
import { listStoriesData } from '../initial-props/component-data/listStoriesData'
import { ListStoriesStoryblok } from '../../typings/generated/components-schema'
import { getListStoriesParams } from './getListStoriesParams'
import { CONFIG } from '@CONFIG'

const itemObj: ListStoriesStoryblok = {
  _uid: 'e5f6705b-b3d2-4940-a6b1-96b3618d3126',
  component: 'list_stories',
  pagination: [
    {
      _uid: '52e87d37-062a-40ff-9ec0-a5524c8be053',
      component: 'pagination',
      items_per_page: 6
    }
  ],
  view_types: ['page'],
  enable_search: false,
  news_categories: [],
  page_categories: [
    'ea7d7cda-c125-4844-b5a3-20c606582959',
    '6c84053b-e4b4-4331-8092-8e212c9bd744'
  ],
  event_categories: [],
  enable_min_height: false,
  not_found_message: [],
  match_all_categories: false
}

const testObj: StoriesParams = {
  resolve_links: 'url',
  resolve_relations:
    'static_section.container,form_container.form,event.category,news.category,page.categories',
  per_page: 3,
  filter_query: {
    component: {
      in: 'page'
    },
    __or: [
      {
        categories: {
          in_array: 'ea7d7cda-c125-4844-b5a3-20c606582959'
        }
      }
    ]
  },
  sort_by:
    'content.published_at:desc,content.preview_publish_date:desc,content.start:desc,content.title:asc'
}
describe('Test params to query string', () => {
  test('queryStringify is identical to qs', () => {
    const str1 = queryStringify(testObj)
    const str2 = stringify(testObj, {
      arrayFormat: 'brackets'
    })
    expect(str1).toBe(str2)
  })
  test('result of StoryblokService is identical to fetch', async () => {
    CONFIG.previewToken = 'GQ4XH9a9sMoYg4NWGWv3awtt'
    CONFIG.publicToken = 'gfiuPfTDZQPeYwgnhOSSjwtt'
    let pageProps = { locale: 'en', defaultLocale: 'en' }
    const serverRes = await listStoriesData(itemObj, pageProps)
    const params = JSON.stringify(getListStoriesParams(itemObj, pageProps))
    const stories = await fetchListStories(params, serverRes.data.cv, true)
    expect(serverRes.total).toBeGreaterThan(0)
    expect(stories.total).toBe(serverRes.total)
  })
})

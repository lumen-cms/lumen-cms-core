import { queryStringify } from './paramsToQueryString'
import { stringify } from 'qs'
import { ISbStoriesParams } from 'storyblok-js-client/types/interfaces'

const testObj: ISbStoriesParams = {
  resolve_links: 'url',
  resolve_relations:
    'static_section.container,form_container.form,event.category,news.category,page.categories',
  per_page: 3,
  filter_query: {
    component: {
      in: 'page'
    },
    // @ts-ignore
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
})

import { expect, expectTypeOf, it, vi } from 'vitest'
import type { ISbStoryData } from 'storyblok-js-client'
import type { CardListItemProps } from '../../components/card/cardTypes'
import type { LmFormTextFieldProps } from '../../components/form-builder/formBuilderTypes'
import type {
  CategoryStoryblok,
  ImageStoryblok,
  ListStoriesStoryblok
} from '../../typings/generated/components-schema'
import { storyblokRelationIds } from './storyblokRelations'
import { getListStoriesParams } from './getListStoriesParams'
import { fetchListStories } from '../../components/list-widget/listUtils/fetchListStories'
import { getContentFields } from '../../components/list-widget/listUtils/getContentFields'
import type { ListStoriesData } from '../../components/list-widget/listWidgetTypes'

const service = vi.hoisted(() => ({ getStories: vi.fn() }))
vi.mock('../storyblok/browserClient', () => ({
  getBrowserStories: service.getStories
}))

it('preserves named option types and accepts both numeric CMS representations', () => {
  expectTypeOf<CardListItemProps['options']['title_custom']>().not.toBeAny()
  expectTypeOf<LmFormTextFieldProps['options']['full_width']>().toEqualTypeOf<
    boolean | undefined
  >()
  expectTypeOf<ImageStoryblok['width']>().toEqualTypeOf<
    string | number | undefined
  >()
  expectTypeOf<ImageStoryblok['unmodelled_field']>().toBeUnknown()
})

const category = {
  uuid: 'configured-category',
  content: { component: 'category', _uid: 'cat', name: 'Training' }
} as ISbStoryData<CategoryStoryblok>
const list: ListStoriesStoryblok = {
  _uid: 'list',
  component: 'list_stories',
  page_categories: [category],
  match_all_categories: true
}

it('keeps unresolved and expanded category filters as ordered UUIDs', () => {
  expect(storyblokRelationIds(['first', category])).toEqual([
    'first',
    'configured-category'
  ])
  expect(storyblokRelationIds()).toEqual([])
  const params = getListStoriesParams(list, {})
  expect(params.filter_query).toMatchObject({
    __or: [{ categories: { all_in_array: 'configured-category' } }]
  })
})

it('combines searched and configured categories without nested arrays', async () => {
  service.getStories.mockResolvedValueOnce({
    data: { stories: [], cv: 123 },
    total: 0
  })
  await fetchListStories({
    content: list,
    searchCategories: ['searched-category'],
    page: 2,
    pageProps: {}
  })
  expect(service.getStories).toHaveBeenCalledWith(
    expect.objectContaining({
      page: 2,
      filter_query: expect.objectContaining({
        __or: [
          {
            categories: {
              all_in_array: 'searched-category,configured-category'
            }
          }
        ]
      })
    })
  )
})

it('preserves preview fallback order and ignores unresolved category labels', () => {
  const story = {
    name: 'Story name',
    content: {
      component: 'page',
      _uid: 'page',
      preview_title: 'Preview title',
      meta_title: 'SEO title',
      preview_teaser: 'Preview teaser',
      categories: ['unresolved', category]
    }
  } as ListStoriesData
  expect(getContentFields(story, {})).toEqual({
    image: undefined,
    title: 'Preview title',
    description: 'Preview teaser',
    subtitle: 'Training'
  })
  expect(getContentFields(story, { hide_category: true }).subtitle).toBe('')
})

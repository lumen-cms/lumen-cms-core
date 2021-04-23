import { LmStoryblokService } from '../utils/initial-props/StoryblokService'

// todo...
// interface StorybookState {
//   allTags: { value: string; label: string }[]
// }

// const storybookDefault: StorybookState = {
//   allTags: []
// }
// export const {
//   setGlobalState,
//   useGlobalState,
//   getGlobalState
// } = createGlobalState(storybookDefault)

export const fetchStoryblokContent = async () => {
  const [categories, stories] = await Promise.all([
    // TODO
    LmStoryblokService.getAll('cdn/stories', {
      per_page: 25,
      sort_by: 'content.name:asc',
      filter_query: {
        component: {
          in: 'category'
        }
      }
    }),
    LmStoryblokService.getAll(`cdn/stories`, {
      per_page: 25,
      excluding_fields:
        'body,meta_robots,property,meta_title,meta_description,seo_body',
      sort_by: 'published_at:desc',
      filter_query: {
        component: {
          in: 'page'
        }
      }
    })
  ])
  return { categories, stories }
}

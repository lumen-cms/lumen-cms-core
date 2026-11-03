import type { ListStoriesData, LmListStoriesProps } from 'lumen-cms-shared/core/components/list-widget/listWidgetTypes'
export const storyMarkers = { uuid: '__LM_STORY_UUID__', title: '__LM_STORY_TITLE__', name: '__LM_STORY_NAME__', subtitle: '__LM_STORY_SUBTITLE__', description: '__LM_STORY_DESCRIPTION__', link: '__LM_STORY_LINK__' }
export const templateImage = 'https://a.storyblok.com/f/1/1200x800/__lm_story_image__.jpg'
export function templateStory(index: number): ListStoriesData {
 return { uuid: storyMarkers.uuid, full_slug: storyMarkers.link, name: storyMarkers.title, content: { component: 'page', title: storyMarkers.title, preview_title: storyMarkers.name, preview_subtitle: index & 2 ? storyMarkers.subtitle : '', preview_teaser: index & 4 ? storyMarkers.description : '', preview_image: index & 1 ? templateImage : undefined } } as unknown as ListStoriesData
}
export function templateLayout(layout: LmListStoriesProps['content']['layout']) {
 const result = structuredClone(layout)
 const options = result?.[0]
 if (options?.component === 'card_list') {
  const limit = Number(options.description_max_character)
  const custom = options.description_custom?.[0]
  if (options.description_max_character && custom?.text && custom.text.length > limit) custom.text = custom.text.slice(0, Math.max(0, limit)) + '..'
  // Dynamic descriptions are truncated before binding, never truncate a marker.
  // Numeric zero hides descriptions; unlike string "0", it is not truncation.
  if ((options.description_max_character as unknown) !== 0) delete options.description_max_character
 }
 return result
}

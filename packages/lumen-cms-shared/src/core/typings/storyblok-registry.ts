import type {} from './storyblok-extensions'
import type { GeneratedStoryblokComponentMap, GeneratedStoryblokContent } from './storyblok/types/82895/registry'
export interface StoryblokComponentMap extends GeneratedStoryblokComponentMap {}
export type StoryblokComponentName = keyof StoryblokComponentMap
export type CoreStoryblokContent = GeneratedStoryblokContent
export type StoryblokContent = StoryblokComponentMap[StoryblokComponentName] & { _editable?: string; _uid?: string }
export type DynamicStoryblokProps<C extends StoryblokContent = StoryblokContent> = { content: C; i?: number }

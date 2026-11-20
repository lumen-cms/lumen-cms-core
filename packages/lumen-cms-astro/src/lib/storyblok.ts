import { defineStoryblokBlocks, type StoryblokComponentMap } from '@storyblok/astro'
import { components } from './componentRegistry.mjs'
import Unknown from '../components/blocks/Unknown.astro'
import type { BlockProps, componentOptions } from './blockProps'

type RendererProps = Omit<BlockProps, 'options'> & { options?: ReturnType<typeof componentOptions>; theme: BlockProps['context']['theme'] }

// Lumen narrows each component's content by its registry key at dispatch.
// The SDK map cannot express this key/content relationship.
// Defer component references because nested blocks import this registry.
export const { StoryblokBlock, StoryblokRichText } = defineStoryblokBlocks<RendererProps>(() => ({
 components: components as unknown as StoryblokComponentMap<RendererProps>, fallback: Unknown as StoryblokComponentMap<RendererProps>[string],
}))

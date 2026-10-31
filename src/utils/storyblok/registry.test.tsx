import { lazy, memo, type ComponentType } from 'react'
import { expect, expectTypeOf, it } from 'vitest'
import type {
  ButtonStoryblok,
  ImageStoryblok
} from '../../typings/generated/components-schema'
import type {
  CoreStoryblokContent,
  StoryblokComponentMap,
  StoryblokRendererProps,
  StoryblokRendererRegistry
} from '../../typings/storyblok-registry'
import { LmComponentRender } from '../../components/CoreComponents'
import {
  registerStoryblokComponent,
  registerStoryblokComponents,
  LmCoreComponents
} from '../config'

const ButtonRenderer = ({ content }: { content: ButtonStoryblok }) => (
  <button>{content.label}</button>
)
const ImageRenderer = ({ content }: { content: ImageStoryblok }) => (
  <span>{content.source}</span>
)

it('checks direct, memoized, and lazy registrations against the keyed schema type', () => {
  const registry: StoryblokRendererRegistry = {}
  registry.button = ButtonRenderer
  registry.button = memo(ButtonRenderer)
  registry.button = lazy(async () => ({ default: ButtonRenderer }))
  // @ts-expect-error An image renderer cannot receive button content.
  registry.button = ImageRenderer
  // @ts-expect-error Undeclared component names cannot enter the registry.
  registry.unknown_component = ButtonRenderer
  expect(registry).toBeDefined()
  expectTypeOf<
    StoryblokComponentMap['button']
  >().toEqualTypeOf<ButtonStoryblok>()
  expectTypeOf<
    StoryblokRendererProps<'button'>['content']
  >().toEqualTypeOf<ButtonStoryblok>()
})

it('preserves overrides through the checked registration helpers', () => {
  const previous = LmCoreComponents.button
  try {
    registerStoryblokComponent('button', ButtonRenderer)
    expect(LmCoreComponents.button).toBe(ButtonRenderer)
    const replacement = memo(ButtonRenderer)
    registerStoryblokComponents({ button: replacement })
    expect(LmCoreComponents.button).toBe(replacement)
  } finally {
    LmCoreComponents.button = previous
  }
})

// Compile-only rejection cases. Never execute malformed registrations or hooks.
export function checkRegistryTypes(
  image: ComponentType<{ content: ImageStoryblok }>,
  name: 'button' | 'image'
) {
  // @ts-expect-error The renderer must match the name; inference cannot widen to a union.
  registerStoryblokComponent('button', image)
  // @ts-expect-error An uncertain key cannot be paired with a renderer for only one branch.
  registerStoryblokComponent(name, image)
  // @ts-expect-error Bulk registration is checked too.
  registerStoryblokComponents({ button: image })
  // @ts-expect-error A typo cannot be smuggled in beside a valid registration.
  registerStoryblokComponents({ button: ButtonRenderer, typo: ButtonRenderer })
  const wrongButton = { component: 'button', _uid: 'b', label: 12 } as const
  const unknown = { component: 'unknown_component', _uid: 'u' } as const
  const item = { component: 'card_list_item', _uid: 'i' } as const
  const swiper = { component: 'swiper', _uid: 's' } as const
  const hook = { component: 'lm_app_providers', _uid: 'p' } as const
  // @ts-expect-error The rendered content must have the generated field types.
  LmComponentRender({ content: wrongButton })
  // @ts-expect-error Unknown component names require an explicit map extension.
  LmComponentRender({ content: unknown })
  // @ts-expect-error A card item needs its parent's options.
  LmComponentRender({ content: item })
  // @ts-expect-error Provider hooks cannot be dispatched as CMS components.
  LmComponentRender({ content: hook })
  // @ts-expect-error Options must be for a card list, not a swiper.
  LmComponentRender({ content: item, options: swiper })
  LmComponentRender({
    content: item,
    options: { component: 'card_list', _uid: 'c' }
  })
  LmComponentRender({
    content: { component: 'button', _uid: 'b' },
    onClick: () => {}
  })
}

type IncorrectDiscriminators = {
  [Name in keyof StoryblokComponentMap]: StoryblokComponentMap[Name] extends {
    component: Name
  }
    ? never
    : Name
}[keyof StoryblokComponentMap]
type IncorrectRendererContent = {
  [
    Name in keyof StoryblokComponentMap
  ]: StoryblokRendererProps<Name>['content'] extends { component: Name }
    ? never
    : Name
}[keyof StoryblokComponentMap]
it('keeps every registry name aligned with its content discriminator', () => {
  expectTypeOf<IncorrectDiscriminators>().toBeNever()
  expectTypeOf<IncorrectRendererContent>().toBeNever()
  expectTypeOf<
    Extract<CoreStoryblokContent, { component: 'button' }>
  >().toEqualTypeOf<ButtonStoryblok>()
})

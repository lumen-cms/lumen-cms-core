import type { StoryblokContent } from 'lumen-cms-shared/core/typings/storyblok-registry'
import type { FormBuilderStoryblok, SwiperStoryblok, AccordionStoryblok, TimelineStoryblok, ImageListStoryblok, HeadlineStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import type { CardListItemProps } from 'lumen-cms-shared/core/components/card/cardTypes'
import type { LmFormBuilderProps } from 'lumen-cms-shared/core/components/form-builder/formBuilderTypes'
import type { RenderContext } from './context'
export interface BlockProps extends Pick<LmFormBuilderProps, 'additional_fields' | 'success_message'> { content: StoryblokContent; context: RenderContext; direction?: string; sectionPosition?: number; options?: FormBuilderStoryblok | SwiperStoryblok | CardListItemProps['options'] | AccordionStoryblok | TimelineStoryblok | HeadlineStoryblok; disablePagination?: boolean; initialOpen?: boolean; isLast?: boolean; styleClass?: string; listProps?: ImageListStoryblok }

export function blockChildren(value: unknown): StoryblokContent[] {
 return Array.isArray(value) ? value.filter((item): item is StoryblokContent => !!item && typeof item === 'object' && typeof item.component === 'string') : []
}

const optionParents: Record<string, string> = {
  timeline_item: 'timeline', nav_item: 'headline', nav_menu_item: 'headline',
  form_textfield: 'form_builder', form_select: 'form_builder', form_checkbox: 'form_builder',
  card_list_item: 'card_list', accordion_item: 'accordion', swiper_item: 'swiper',
 }

// Parent options have different contracts across nested block types.
export function componentOptions({ content, options, listProps }: BlockProps) {
 if (content.component === 'image_list_item') return listProps

 const parent = optionParents[content.component]
 return parent ? options?.component === parent ? options : undefined : options
}

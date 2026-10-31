import type { ComponentType, PropsWithChildren } from 'react'
import type {} from './storyblok-extensions'
import type {
  GeneratedStoryblokComponentMap,
  GeneratedStoryblokContent
} from './storyblok/types/82895/registry'

export type CoreStoryblokContent = GeneratedStoryblokContent

// Consumers extend this interface with types from separately generated schemas.
export interface StoryblokComponentMap extends GeneratedStoryblokComponentMap {}

export type StoryblokComponentName = keyof StoryblokComponentMap
export type StoryblokContent = StoryblokRendererProps['content'] & {
  _editable?: string
  _uid?: string
}
// Parent-provided props and server-enriched content used by existing renderers.
export interface StoryblokRendererPropsOverrides {
  image: import('../components/image/imageTypes').LmImageProps
  section: import('../components/section/sectionTypes').LmSectionProps
  section_parallax: import('../components/section/sectionTypes').LmSectionParallaxProps
  ecommerce_checkout: import('../components/ecommerce/ecommerceTpyes').LmEcommerceCheckoutProps

  divider: import('../components/divider/dividerTypes').LmDividerProps
  card_list: import('../components/card/cardTypes').LmCardListProps
  hubspot_meeting: import('../components/hubspot-meeting/hubspotTypes').LmHubspotMeetingProps

  button: PropsWithChildren<
    import('../components/button/buttonTypes').LmButtonProps
  >
  headline: PropsWithChildren<
    import('../components/headline/headlineTypes').LmHeadlineProps
  >
  form_builder: import('../components/form-builder/formBuilderTypes').LmFormBuilderProps

  accordion_item: import('../components/accordion/accordionTypes').LmAccordionItemProps
  column: import('../components/section/sectionTypes').LmGridColumnProps
  image_list_item: import('../components/image-list/imageListTypes').LmImageListItemProps
  timeline_item: import('../components/timeline/timelineTypes').LmTimelineItemProps
  nav_item: import('../components/nav-list/navListTypes').LmNavItemProps
  card_list_item: import('../components/card/cardTypes').CardListItemProps
  form_textfield: import('../components/form-builder/formBuilderTypes').LmFormTextFieldProps
  form_select: import('../components/form-builder/formBuilderTypes').LmSelectFieldProps
  form_checkbox: import('../components/form-builder/formBuilderTypes').LmFormCheckboxProps
  swiper_item: import('../components/slider/sliderTypes').LmSwiperItemProps
  ecommerce_fastspring_product: import('../components/ecommerce/fastspring/fastSpringTypes').FastSpringCheckoutProps
  ecommerce_shopify_checkout: import('../components/ecommerce/shopify/shopifyTypes').LmShopifyCheckoutProps
  section_video_bg: import('../components/section/sectionTypes').LmSectionVideoProps
  category_box: import('../components/list-widget/listWidgetTypes').LmCategoryBoxProps
  list_widget: import('../components/list-widget/listWidgetTypes').LmListWidgetProps
  list_stories: import('../components/list-widget/listWidgetTypes').LmListStoriesProps
  event_calendar: import('../components/event/eventTypes').LmEventCalendarProps
  event: import('../components/event/eventTypes').LmEventProps
  news: import('../components/news/newsTypes').LmNewsProps
  static_section: import('../components/static-section/staticTypes').LmStaticSectionProps
  form: import('../components/google-form/googleFormProps').LmGoogleFormProps
  form_container: import('../components/form-builder/formBuilderTypes').LmFormContainerProps
}

type PropsFor<Name extends StoryblokComponentName> =
  Name extends keyof StoryblokRendererPropsOverrides
    ? StoryblokRendererPropsOverrides[Name]
    : { content: StoryblokComponentMap[Name] }

export type StoryblokRendererProps<
  K extends StoryblokComponentName = StoryblokComponentName
> = {
  [Name in K]: PropsFor<Name> extends { content: { component: Name } }
    ? PropsFor<Name> & { i?: number }
    : never
}[K]
export type StoryblokRendererRegistry = {
  [K in StoryblokComponentName]?: [StoryblokRendererProps<K>] extends [never]
    ? never
    : ComponentType<StoryblokRendererProps<K>>
}

// A union of child bloks must supply the props required by every possible child.
type UnionToIntersection<T> = (
  T extends unknown ? (value: T) => void : never
) extends (value: infer I) => void
  ? I
  : never
export type StoryblokRenderExtras<K extends StoryblokComponentName> =
  UnionToIntersection<
    {
      [Name in K]: Omit<StoryblokRendererProps<Name>, 'content'>
    }[K]
  >
export type DynamicStoryblokProps<
  C extends StoryblokContent = StoryblokContent
> = {
  content: C
  i?: number
} & StoryblokRenderExtras<NoInfer<C['component']>>

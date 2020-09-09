import { FC, JSXElementConstructor, ReactNode } from 'react'
import { LmTimelineItemProps, LmTimelineProps } from '../components/timeline/timelineTypes'
import { LmInstagramListProps, LmInstagramPostProps } from '../components/instagram/instagramTypes'
import { LmAccordionItemProps, LmAccordionProps } from '../components/accordion/accordionTypes'
import { LmAvatarProps } from '../components/avatar/avatarTypes'
import { LmButtonProps } from '../components/button/buttonTypes'
import { LmButtonListProps } from '../components/button-list/buttonListTypes'
import { CardListItemProps, LmCardListProps } from '../components/card/cardTypes'
import { LmDialogProps } from '../components/dialog/dialogTypes'
import { LmDividerProps } from '../components/divider/dividerTypes'
import { LmFlexRowProps } from '../components/flex-row/flexRowTypes'
import { LmDateHeadlineProps, LmHeadlineProps } from '../components/headline/headlineTypes'
import { LmHtmlProps } from '../components/html/htmlTypes'
import { LmHubspotMeetingProps } from '../components/hubspot-meeting/hubspotTypes'
import { LmIconProps } from '../components/icon/iconTypes'
import { LmIframeAdvancedProps, LmIframeProps } from '../components/iframe/iframeTypes'
import { LmImageProps } from '../components/image/imageTypes'
import { LmImageListItemProps, LmImageListProps } from '../components/image-list/imageListTypes'
import { LinkProps, LmLinkProps } from '../components/link/linkTypes'
import {
  LmCategoryBoxProps,
  LmListSearchAutocompleteProps,
  LmListSearchFieldProps,
  LmListWidgetProps
} from '../components/list-widget/listWidgetTypes'
import { LmMenuProps } from '../components/menu/menuTypes'
import { LmMotionProps } from '../components/motion/motionTypes'
import { LmNavListProps } from '../components/nav-list/navListTypes'
import { LmPageProps } from '../components/page/pageTypes'
import { LmParagraphProps, LmRichTextParagraphProps } from '../components/paragraph/paragraphTypes'
import { LmPlayerProps } from '../components/player/playerTypes'
import {
  LmGridColumnProps,
  LmGridRowProps,
  LmSectionParallaxProps,
  LmSectionProps,
  LmSectionVideoProps
} from '../components/section/sectionTypes'
import { LmSliderProps } from '../components/slider/sliderTypes'
import { LmStaticContainerProps, LmStaticSectionProps } from '../components/static-section/staticTypes'
import { LmTableProps } from '../components/table/tableTypes'
import { LmTabsProps } from '../components/tabs/tabsTypes'
import {
  LmToggleDrawerButtonProps,
  LmToolbarLogoProps,
  LmToolbarSectionProps
} from '../components/layout/toolbar/toolbarTypes'

type AppConfigProps = {
  href: string
  defaultLocale: string
  publicToken: string
  previewToken: string
  languages: string[]
  rootDirectory?: string
  overwriteLocale?: string
  suppressSlugLocale?: boolean
  suppressSlugIncludeDefault?: boolean
  overwriteDisableIndex?: boolean
  GA?: string
  TAWKTO?: string
  prefetch: boolean
  hostname?: string
}

export const CONFIG: AppConfigProps = {
  href: process.env.HREF || '/[...index]',
  previewToken: process.env.NEXT_PUBLIC_PREVIEW_TOKEN || '',
  publicToken: process.env.NEXT_PUBLIC_PUBLIC_TOKEN || '',
  languages:
    (process.env.NEXT_PUBLIC_LANGUAGES &&
      process.env.NEXT_PUBLIC_LANGUAGES.split(',')) ||
    [],
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en',
  rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
  overwriteLocale: process.env.NEXT_PUBLIC_OVERWRITE_LOCALE,
  suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE,
  overwriteDisableIndex: !!process.env.NEXT_PUBLIC_OVERWRITE_DISABLE_INDEX,
  GA: process.env.NEXT_PUBLIC_GA,
  TAWKTO: process.env.NEXT_PUBLIC_TAWKTO,
  prefetch: !process.env.NEXT_PUBLIC_DISABLE_PREFETCH
}

export const GoogleFormExampleUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSdw3tdslj4k94OU6bluk0Yobe997r8gV5obEbEdiMs70SKQPw/viewform?embedded=true'

type LmCoreComponentsProps = {
  page?: JSXElementConstructor<LmPageProps>
  accordion?: JSXElementConstructor<LmAccordionProps>
  accordion_item?: JSXElementConstructor<LmAccordionItemProps>
  table?: JSXElementConstructor<LmTableProps>
  static_section?: JSXElementConstructor<LmStaticSectionProps>
  static_container?: JSXElementConstructor<LmStaticContainerProps>
  divider?: JSXElementConstructor<LmDividerProps>
  html?: JSXElementConstructor<LmHtmlProps>
  hubspot_meeting?: JSXElementConstructor<LmHubspotMeetingProps>
  button_list?: JSXElementConstructor<LmButtonListProps>
  section?: JSXElementConstructor<LmSectionProps>
  headline?: JSXElementConstructor<LmHeadlineProps>
  paragraph?: JSXElementConstructor<LmParagraphProps>
  row?: JSXElementConstructor<LmGridRowProps>
  column?: JSXElementConstructor<LmGridColumnProps>
  image?: JSXElementConstructor<LmImageProps>
  image_list?: JSXElementConstructor<LmImageListProps>
  image_list_item?: JSXElementConstructor<LmImageListItemProps>
  button?: JSXElementConstructor<LmButtonProps>
  nav_list?: JSXElementConstructor<LmNavListProps>
  nav_menu?: JSXElementConstructor<LmMenuProps>
  icon?: JSXElementConstructor<LmIconProps>
  iframe?: JSXElementConstructor<LmIframeProps>
  slider?: JSXElementConstructor<LmSliderProps>
  section_video_bg?: JSXElementConstructor<LmSectionVideoProps>
  card_list?: JSXElementConstructor<LmCardListProps>
  card_list_item?: JSXElementConstructor<CardListItemProps>
  section_parallax?: JSXElementConstructor<LmSectionParallaxProps>
  tabs?: JSXElementConstructor<LmTabsProps>
  list_widget?: JSXElementConstructor<LmListWidgetProps>
  flex_row?: JSXElementConstructor<LmFlexRowProps>
  iframe_advanced?: JSXElementConstructor<LmIframeAdvancedProps>
  category_box?: JSXElementConstructor<LmCategoryBoxProps>
  list_search_field?: JSXElementConstructor<LmListSearchFieldProps>
  link?: JSXElementConstructor<LmLinkProps>
  list_search_autocomplete?: JSXElementConstructor<LmListSearchAutocompleteProps>
  rich_text_editor?: JSXElementConstructor<LmRichTextParagraphProps>
  timeline?: JSXElementConstructor<LmTimelineProps>
  timeline_item?: JSXElementConstructor<LmTimelineItemProps>
  avatar?: JSXElementConstructor<LmAvatarProps>
  date_headline?: JSXElementConstructor<LmDateHeadlineProps>
  motion?: JSXElementConstructor<LmMotionProps>
  toolbar_logo?: JSXElementConstructor<LmToolbarLogoProps>
  toolbar_navi_button?: JSXElementConstructor<LmToggleDrawerButtonProps>
  player?: JSXElementConstructor<LmPlayerProps>
  toolbar_row_section?: JSXElementConstructor<LmToolbarSectionProps>
  dialog?: JSXElementConstructor<LmDialogProps>
  instagram_post?: JSXElementConstructor<LmInstagramPostProps>
  instagram_list?: JSXElementConstructor<LmInstagramListProps>
  lm_link_render?: JSXElementConstructor<LinkProps>
  lm_app_providers: FC<any>[]
  [k: string]: ReactNode | null
}

export const LmCoreComponents: LmCoreComponentsProps = {
  lm_app_providers: []
}

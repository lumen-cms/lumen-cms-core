import { JSXElementConstructor, ReactNode } from 'react'
import { LmPageProps } from '../components/page/Page'
import { LmAccordionProps } from '../components/accordion/Accordion'
import { LmAccordionItemProps } from '../components/accordion/AccordionItem'
import { LmTableProps } from '../components/table/Table'
import { LmStaticSectionProps } from '../components/static-section/StaticSection'
import { LmStaticContainerProps } from '../components/static-section/StaticContainer'
import { LmDividerProps } from '../components/divider/Divider'
import { LmHtmlProps } from '../components/html/Html'
import { LmHubspotMeetingProps } from '../components/hubspot-meeting/HubspotMeeting'
import { LmButtonListProps } from '../components/button-list/ButtonList'
import { LmSectionProps } from '../components/section/Section'
import { LmHeadlineProps } from '../components/headline/Headline'
import { LmParagraphProps } from '../components/paragraph/Paragraph'
import { LmGridRowProps } from '../components/section/GridRow'
import { LmGridColumnProps } from '../components/section/GridColumn'
import { LmImageProps } from '../components/image/ImageElement'
import { LmImageListProps } from '../components/image-list/ImageList'
import { LmImageListItemProps } from '../components/image-list/ImageListItem'
import { LmButtonProps } from '../components/button/Button'
import { LmNavListProps } from '../components/nav-list/NavList'
import { LmMenuProps } from '../components/menu/NavMenu'
import { LmIconProps } from '../components/icon/Icon'
import { LmIframeProps } from '../components/iframe/Iframe'
import { LmSliderProps } from '../components/slider/Slider'
import { LmSectionVideoProps } from '../components/section/SectionVideoBg'
import { LmCardListProps } from '../components/card/CardList'
import { CardListItemProps } from '../components/card/cards'
import { LmSectionParallaxProps } from '../components/section/SectionParallax'
import { LmTabsProps } from '../components/tabs/Tabs'
import { LmListWidgetProps } from '../components/list-widget/ListWidget'
import { LmFlexRowProps } from '../components/flex-row/FlexRow'
import { LmIframeAdvancedProps } from '../components/iframe/IframeAdvanced'
import { LmCategoryBoxProps } from '../components/list-widget/CategoryBox'
import { LmListSearchFieldProps } from '../components/list-widget/ListSearchField'
import { LmLinkProps } from '../components/link/Link'
import { LmListSearchAutocompleteProps } from '../components/list-widget/ListSearchAutocomplete'
import { LmRichTextParagraphProps } from '../components/paragraph/RichTextParagraph'
import {
  LmTimelineItemProps,
  LmTimelineProps
} from '../components/timeline/TimelineProps'
import { LmAvatarProps } from '../components/avatar/LmAvatar'
import { LmDateHeadlineProps } from '../components/headline/DateHeadline'
import { LmMotionProps } from '../components/motion/Motion'
import { LmToolbarLogoProps } from '../components/layout/toolbar/ToolbarLogo'
import { LmToggleDrawerButtonProps } from '../components/layout/toolbar/ToggleDrawerButton'
import { LmPlayerProps } from '../components/player/Player'
import { LmToolbarSectionProps } from '../components/layout/toolbar/ToolbarSection'
import { LmDialogProps } from '../components/dialog/Dialog'
import {
  LmInstagramListProps,
  LmInstagramPostProps
} from '../components/instagram/instaTypes'

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
  list_search_autocomplete?: JSXElementConstructor<
    LmListSearchAutocompleteProps
  >
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
  [k: string]: ReactNode | null
}

export const LmCoreComponents: LmCoreComponentsProps = {}

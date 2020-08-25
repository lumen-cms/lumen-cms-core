import React, {
  Attributes,
  ComponentClass,
  FC,
  JSXElementConstructor,
  ReactNode
} from 'react'
import SbEditable from 'storyblok-react'
import { LmPage, LmPageProps } from './page/Page'
import { LmTable, LmTableProps } from './table/Table'
import { LmAccordion, LmAccordionProps } from './accordion/Accordion'
import {
  LmAccordionItem,
  LmAccordionItemProps
} from './accordion/AccordionItem'
import {
  LmStaticSection,
  LmStaticSectionProps
} from './static-section/StaticSection'
import {
  LmStaticContainer,
  LmStaticContainerProps
} from './static-section/StaticContainer'
import { LmDivider, LmDividerProps } from './divider/Divider'
import { LmHtml, LmHtmlProps } from './html/Html'
import {
  LmHubspotMeeting,
  LmHubspotMeetingProps
} from './hubspot-meeting/HubspotMeeting'
import { LmButtonList, LmButtonListProps } from './button-list/ButtonList'
import { LmSection, LmSectionProps } from './section/Section'
import { LmHeadline, LmHeadlineProps } from './headline/Headline'
import { LmParagraph, LmParagraphProps } from './paragraph/Paragraph'
import { LmGridRow, LmGridRowProps } from './section/GridRow'
import { LmGridColumn, LmGridColumnProps } from './section/GridColumn'
import { LmImage, LmImageProps } from './image/ImageElement'
import { LmImageList, LmImageListProps } from './image-list/ImageList'
import {
  LmImageListItem,
  LmImageListItemProps
} from './image-list/ImageListItem'
import { LmButton, LmButtonProps } from './button/Button'
import { LmNavList, LmNavListProps } from './nav-list/NavList'
import { LmMenu, LmMenuProps } from './menu/NavMenu'
import { LmIcon, LmIconProps } from './icon/Icon'
import { LmIframe, LmIframeProps } from './iframe/Iframe'
import { LmSlider, LmSliderProps } from './slider/Slider'
import { LmSectionVideo, LmSectionVideoProps } from './section/SectionVideoBg'
import { LmCardList, LmCardListProps } from './card/CardList'
import { LmCardListItem } from './card/CardListItem'
import {
  LmSectionParallax,
  LmSectionParallaxProps
} from './section/SectionParallax'
import { LmTabs, LmTabsProps } from './tabs/Tabs'
import { LmListWidget, LmListWidgetProps } from './list-widget/ListWidget'
import { LmFlexRow, LmFlexRowProps } from './flex-row/FlexRow'
import {
  LmIframeAdvanced,
  LmIframeAdvancedProps
} from './iframe/IframeAdvanced'
import { LmCategoryBox, LmCategoryBoxProps } from './list-widget/CategoryBox'
import {
  LmListSearchField,
  LmListSearchFieldProps
} from './list-widget/ListSearchField'
import { LmLink, LmLinkProps } from './link/Link'
import {
  LmListSearchAutocomplete,
  LmListSearchAutocompleteProps
} from './list-widget/ListSearchAutocomplete'
import {
  LmRichTextParagraph,
  LmRichTextParagraphProps
} from './paragraph/RichTextParagraph'
import { LmTimeline } from './timeline/Timeline'
import { LmTimelineItem } from './timeline/TimelineRow'
import { LmAvatar, LmAvatarProps } from './avatar/LmAvatar'
import { LmDateHeadline, LmDateHeadlineProps } from './headline/DateHeadline'
import { LmMotion, LmMotionProps } from './motion/Motion'
import { LmToolbarLogo, LmToolbarLogoProps } from './layout/toolbar/ToolbarLogo'
import {
  LmToggleDrawerButton,
  LmToggleDrawerButtonProps
} from './layout/toolbar/ToggleDrawerButton'
import { LmPlayer, LmPlayerProps } from './player/Player'
import {
  LmToolbarSection,
  LmToolbarSectionProps
} from './layout/toolbar/ToolbarSection'
import { LmDialog, LmDialogProps } from './dialog/Dialog'
import { LmInstagramPost } from './instagram/InstagramPost'
import { LmInstagramList } from './instagram/InstagramList'
import { ComponentRenderFuncProps } from '../typings/app'
import { useAppContext } from './provider/context/AppContext'
import {
  LmInstagramListProps,
  LmInstagramPostProps
} from './instagram/instaTypes'
import { CardListItemProps } from './card/cards'
import { LmTimelineItemProps, LmTimelineProps } from './timeline/TimelineProps'

export type LmCoreComponentsProps = {
  page: JSXElementConstructor<LmPageProps>
  accordion: JSXElementConstructor<LmAccordionProps>
  accordion_item: JSXElementConstructor<LmAccordionItemProps>
  table: JSXElementConstructor<LmTableProps>
  static_section: JSXElementConstructor<LmStaticSectionProps>
  static_container: JSXElementConstructor<LmStaticContainerProps>
  divider: JSXElementConstructor<LmDividerProps>
  html: JSXElementConstructor<LmHtmlProps>
  hubspot_meeting: JSXElementConstructor<LmHubspotMeetingProps>
  button_list: JSXElementConstructor<LmButtonListProps>
  section: JSXElementConstructor<LmSectionProps>
  headline: JSXElementConstructor<LmHeadlineProps>
  paragraph: JSXElementConstructor<LmParagraphProps>
  row: JSXElementConstructor<LmGridRowProps>
  column: JSXElementConstructor<LmGridColumnProps>
  image: JSXElementConstructor<LmImageProps>
  image_list: JSXElementConstructor<LmImageListProps>
  image_list_item: JSXElementConstructor<LmImageListItemProps>
  button: JSXElementConstructor<LmButtonProps>
  nav_list: JSXElementConstructor<LmNavListProps>
  nav_menu: JSXElementConstructor<LmMenuProps>
  icon: JSXElementConstructor<LmIconProps>
  iframe: JSXElementConstructor<LmIframeProps>
  slider: JSXElementConstructor<LmSliderProps>
  section_video_bg: JSXElementConstructor<LmSectionVideoProps>
  card_list: JSXElementConstructor<LmCardListProps>
  card_list_item: JSXElementConstructor<CardListItemProps>
  section_parallax: JSXElementConstructor<LmSectionParallaxProps>
  tabs: JSXElementConstructor<LmTabsProps>
  list_widget: JSXElementConstructor<LmListWidgetProps>
  flex_row: JSXElementConstructor<LmFlexRowProps>
  iframe_advanced: JSXElementConstructor<LmIframeAdvancedProps>
  category_box: JSXElementConstructor<LmCategoryBoxProps>
  list_search_field: JSXElementConstructor<LmListSearchFieldProps>
  link: JSXElementConstructor<LmLinkProps>
  list_search_autocomplete: JSXElementConstructor<LmListSearchAutocompleteProps>
  rich_text_editor: JSXElementConstructor<LmRichTextParagraphProps>
  timeline: JSXElementConstructor<LmTimelineProps>
  timeline_item: JSXElementConstructor<LmTimelineItemProps>
  avatar: JSXElementConstructor<LmAvatarProps>
  date_headline: JSXElementConstructor<LmDateHeadlineProps>
  motion: JSXElementConstructor<LmMotionProps>
  toolbar_logo: JSXElementConstructor<LmToolbarLogoProps>
  toolbar_navi_button: JSXElementConstructor<LmToggleDrawerButtonProps>
  player: JSXElementConstructor<LmPlayerProps>
  toolbar_row_section: JSXElementConstructor<LmToolbarSectionProps>
  dialog: JSXElementConstructor<LmDialogProps>
  instagram_post: JSXElementConstructor<LmInstagramPostProps>
  instagram_list: JSXElementConstructor<LmInstagramListProps>
  [k: string]: ReactNode | null
}
export const LmCoreComponents: LmCoreComponentsProps = {
  page: LmPage,
  table: LmTable,
  accordion: LmAccordion,
  accordion_item: LmAccordionItem,
  static_section: LmStaticSection,
  static_container: LmStaticContainer,
  divider: LmDivider,
  html: LmHtml,
  hubspot_meeting: LmHubspotMeeting,
  button_list: LmButtonList,
  section: LmSection,
  headline: LmHeadline,
  paragraph: LmParagraph,
  row: LmGridRow,
  column: LmGridColumn,
  image: LmImage,
  image_list: LmImageList,
  image_list_item: LmImageListItem,
  button: LmButton,
  nav_list: LmNavList,
  nav_menu: LmMenu,
  icon: LmIcon,
  iframe: LmIframe,
  slider: LmSlider,
  section_video_bg: LmSectionVideo,
  card_list: LmCardList,
  card_list_item: LmCardListItem,
  section_parallax: LmSectionParallax,
  tabs: LmTabs,
  list_widget: LmListWidget,
  flex_row: LmFlexRow,
  iframe_advanced: LmIframeAdvanced,
  category_box: LmCategoryBox,
  list_search_field: LmListSearchField,
  link: LmLink,
  list_search_autocomplete: LmListSearchAutocomplete,
  rich_text_editor: LmRichTextParagraph,
  timeline: LmTimeline,
  timeline_item: LmTimelineItem,
  avatar: LmAvatar,
  date_headline: LmDateHeadline,
  motion: LmMotion,
  toolbar_logo: LmToolbarLogo,
  toolbar_navi_button: LmToggleDrawerButton,
  player: LmPlayer,
  toolbar_row_section: LmToolbarSection,
  dialog: LmDialog,
  instagram_post: LmInstagramPost,
  instagram_list: LmInstagramList
}

export function LmComponentRender<P>(
  props: ComponentRenderFuncProps
): JSX.Element {
  const { insideStoryblok } = useAppContext()
  const { content, i, ...rest } = props

  if (typeof LmCoreComponents[content.component] !== 'undefined') {
    const CurrentElement = React.createElement(
      LmCoreComponents[content.component] as FC<P> | ComponentClass<P>,
      ({
        content,
        key:
          typeof i === 'number'
            ? `${content.component}_${content._uid || i}`
            : undefined,
        ...rest
      } as unknown) as Attributes & P
    )
    if (insideStoryblok) {
      return <SbEditable content={content}>{CurrentElement}</SbEditable>
    }
    return CurrentElement
  }
  return (
    <div style={{ color: 'red' }} key={content?._uid || `${i}`}>
      The component {content.component || 'no name found'} has not been created
      yet.
    </div>
  )
}

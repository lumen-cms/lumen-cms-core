import React from 'react'
import { CONFIG, LmCoreComponents } from '@CONFIG'
import LmAccordion from './components/accordion/Accordion'
import LmTable from './components/table/Table'
import { LmDivider } from './components/divider/Divider'
import { LmButtonList } from './components/button-list/ButtonList'
import { LmHeadline } from './components/headline/Headline'
import { LmGridRow } from './components/section/GridRow'
import { LmGridColumn } from './components/section/GridColumn'
import { LmImage } from './components/image/ImageElement'
import { LmHtml } from './components/html/Html'
import LmImageList from './components/image-list/ImageList'
import { LmButton } from './components/button/Button'
import { LmNavList } from './components/nav-list/NavList'
import LmIframe from './components/iframe/Iframe'
import LmSlider from './components/slider/Slider'
import LmSectionVideo from './components/section/SectionVideoBg'
import { LmIcon } from './components/icon/Icon'
import LmCardList from './components/card/CardList'
import LmSectionParallax from './components/section/SectionParallax'
import LmTabs from './components/tabs/Tabs'
import { LmFlexRow } from './components/flex-row/FlexRow'
import { LmRichTextParagraph } from './components/paragraph/RichTextParagraph'
import LmTimeline from './components/timeline/Timeline'
import { LmAvatar } from './components/avatar/LmAvatar'
import { LmDateHeadline } from './components/headline/DateHeadline'
import LmMotion from './components/motion/Motion'
import { LmSection } from './components/section/Section'
import LmAccordionItem from './components/accordion/AccordionItem'
import LmTimelineItem from './components/timeline/TimelineItem'
import LmImageListItem from './components/image-list/ImageListItem'
import LmPlayer from './components/player/Player'

export {
  LmAccordion,
  LmAvatar,
  LmButton,
  LmButtonList,
  LmCardList,
  LmDivider,
  LmFlexRow,
  LmHeadline,
  LmDateHeadline,
  LmHtml,
  LmIcon,
  LmIframe,
  LmImage,
  LmImageList,
  LmSection,
  LmTimeline,
  LmGridRow,
  LmGridColumn,
  LmRichTextParagraph,
  LmTabs,
  LmTable,
  LmSectionParallax,
  LmSlider,
  LmNavList,
  LmSectionVideo,
  LmMotion,
  LmAccordionItem,
  LmImageListItem,
  LmPlayer
}

// export { LmPagesIndex as LmDefaultPage } from './components/pages/PagesIndex'
export { default as LmAppProvider } from './components/provider/AppProvider'
export { useAppContext } from './components/provider/context/AppContext'
export { default as LmAppSetupProvider } from './components/provider/AppSetupProvider'
export { useAppSetup } from './components/provider/context/AppSetupContext'
export { CONFIG } from './utils/config'

LmCoreComponents.table = LmTable
LmCoreComponents.accordion = LmAccordion
LmCoreComponents.accordion_item = LmAccordionItem
LmCoreComponents.divider = LmDivider
LmCoreComponents.button_list = LmButtonList
LmCoreComponents.section = LmSection
LmCoreComponents.headline = LmHeadline
LmCoreComponents.row = LmGridRow
LmCoreComponents.column = LmGridColumn
LmCoreComponents.image = LmImage
LmCoreComponents.image_list = LmImageList
LmCoreComponents.image_list_item = LmImageListItem
LmCoreComponents.html = LmHtml

export const XXX = {
  section: LmSection,
  headline: LmHeadline,
  row: LmGridRow,
  column: LmGridColumn,
  image: LmImage,
  image_list: LmImageList,
  image_list_item: LmImageListItem,
  button: LmButton,
  nav_list: LmNavList,
  icon: LmIcon,
  iframe: LmIframe,
  slider: LmSlider,
  section_video_bg: LmSectionVideo,
  card_list: LmCardList,
  section_parallax: LmSectionParallax,
  tabs: LmTabs,
  flex_row: LmFlexRow,
  rich_text_editor: LmRichTextParagraph,
  timeline: LmTimeline,
  timeline_item: LmTimelineItem,
  avatar: LmAvatar,
  date_headline: LmDateHeadline,
  motion: LmMotion,
  player: LmPlayer
}

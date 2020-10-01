import dynamic from 'next/dynamic'

import { LmPage } from './page/Page'
import { LmTable } from './table/Table'
import { LmStaticSection } from './static-section/StaticSection'
import { LmStaticContainer } from './static-section/StaticContainer'
import { LmDivider } from './divider/Divider'
import { LmHtml } from './html/Html'
import { LmButtonList } from './button-list/ButtonList'
import { LmSection } from './section/Section'
import { LmHeadline } from './headline/Headline'
// import { LmParagraph } from './paragraph/Paragraph'
import { LmGridRow } from './section/GridRow'
import { LmGridColumn } from './section/GridColumn'
import { LmImage } from './image/ImageElement'
import { LmButton } from './button/Button'
import { LmNavList } from './nav-list/NavList'
import { LmMenu } from './menu/NavMenu'
import { LmIcon } from './icon/Icon'
import { LmCardList } from './card/CardList'
import { LmCardListItem } from './card/CardListItem'
import { LmListWidget } from './list-widget/ListWidget'
import { LmFlexRow } from './flex-row/FlexRow'
import { LmLink } from './link/Link'
import { LmRichTextParagraph } from './paragraph/RichTextParagraph'
import { LmAvatar } from './avatar/LmAvatar'
import { LmDateHeadline } from './headline/DateHeadline'
import { LmMotion } from './motion/Motion'
import { LmToolbarLogo } from './layout/toolbar/ToolbarLogo'
import { LmToggleDrawerButton } from './layout/toolbar/ToggleDrawerButton'
import { LmToolbarSection } from './layout/toolbar/ToolbarSection'
import { LmCoreComponents } from '../utils/config'
import MuiNextLink from './link/MuiNextLink'
import { LmToolbarRow } from './layout/toolbar/ToolbarRow'

LmCoreComponents.page = LmPage
LmCoreComponents.table = LmTable

LmCoreComponents.static_section = LmStaticSection
LmCoreComponents.static_container = LmStaticContainer
LmCoreComponents.divider = LmDivider
LmCoreComponents.html = LmHtml

LmCoreComponents.button_list = LmButtonList
LmCoreComponents.section = LmSection
LmCoreComponents.headline = LmHeadline
// LmCoreComponents.paragraph = LmParagraph
LmCoreComponents.row = LmGridRow
LmCoreComponents.column = LmGridColumn
LmCoreComponents.image = LmImage

LmCoreComponents.button = LmButton
LmCoreComponents.nav_list = LmNavList
LmCoreComponents.nav_menu = LmMenu
LmCoreComponents.icon = LmIcon
LmCoreComponents.card_list = LmCardList
LmCoreComponents.card_list_item = LmCardListItem
LmCoreComponents.list_widget = LmListWidget
LmCoreComponents.flex_row = LmFlexRow
LmCoreComponents.link = LmLink
LmCoreComponents.rich_text_editor = LmRichTextParagraph
LmCoreComponents.avatar = LmAvatar
LmCoreComponents.date_headline = LmDateHeadline
LmCoreComponents.motion = LmMotion
LmCoreComponents.toolbar_logo = LmToolbarLogo
LmCoreComponents.toolbar_navi_button = LmToggleDrawerButton
LmCoreComponents.toolbar_row_section = LmToolbarSection
LmCoreComponents.toolbar_row = LmToolbarRow

LmCoreComponents.lm_link_render = MuiNextLink

LmCoreComponents.chat_whatsapp = dynamic(
  () => import(/* webpackChunkName: 'popper' */ './chat/WhatsappChatButton')
)
LmCoreComponents.list_search_autocomplete = dynamic(
  () =>
    import(
      /* webpackChunkName: 'popper' */ './list-widget/ListSearchAutocomplete'
    )
)
LmCoreComponents.category_box = dynamic(
  () => import(/* webpackChunkName: 'popper' */ './list-widget/CategoryBox')
)
LmCoreComponents.list_search_field = dynamic(
  () => import(/* webpackChunkName: 'popper' */ './list-widget/ListSearchField')
)

LmCoreComponents.dialog = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './dialog/Dialog')
)

LmCoreComponents.section_parallax = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './section/SectionParallax')
)

LmCoreComponents.accordion = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './accordion/Accordion')
)
LmCoreComponents.accordion_item = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './accordion/AccordionItem')
)

LmCoreComponents.snackbar = dynamic(
  () => import(/* webpackChunkName: 'snackbar' */ './snackbar/Snackbar')
)
LmCoreComponents.image_list = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './image-list/ImageList')
)
LmCoreComponents.image_list_item = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './image-list/ImageListItem')
)
LmCoreComponents.slider = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './slider/Slider')
)
LmCoreComponents.section_video_bg = dynamic(
  () => import(/* webpackChunkName: 'videoPlayer' */ './section/SectionVideoBg')
)
LmCoreComponents.player = dynamic(
  () => import(/* webpackChunkName: 'videoPlayer' */ './player/Player')
)
LmCoreComponents.timeline_item = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './timeline/TimelineItem')
)
LmCoreComponents.timeline = dynamic(
  () => import(/* webpackChunkName: 'addon' */ './timeline/Timeline')
)
LmCoreComponents.tabs = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './tabs/Tabs')
)
LmCoreComponents.hubspot_meeting = dynamic(
  () =>
    import(/* webpackChunkName: 'hubspot' */ './hubspot-meeting/HubspotMeeting')
)
LmCoreComponents.iframe = dynamic(
  () => import(/* webpackChunkName: 'iframe' */ './iframe/Iframe')
)
// @ts-ignore
LmCoreComponents.iframe_advanced = dynamic(
  () => import(/* webpackChunkName: 'iframe' */ './iframe/Iframe')
)
LmCoreComponents.chat_tawkto = dynamic(
  () => import(/* webpackChunkName: 'tawkto' */ './chat/TawktoChatButton')
)
LmCoreComponents.chat_facebook = dynamic(
  () =>
    import(/* webpackChunkName: 'facebookChat' */ './chat/FacebookChatButton')
)

LmCoreComponents.instagram_post = dynamic(
  () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramPost')
)
LmCoreComponents.instagram_list = dynamic(
  () => import(/* webpackChunkName: 'instagram' */ './instagram/InstagramList')
)

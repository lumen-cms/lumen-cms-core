import dynamic from 'next/dynamic'

import { LmPage } from './page/Page'
import { LmTable } from './table/Table'
import { LmStaticSection } from './static-section/StaticSection'
import { LmStaticContainer } from './static-section/StaticContainer'
import { LmDivider } from './divider/Divider'
import { LmHtml } from './html/Html'
import { LmHubspotMeeting } from './hubspot-meeting/HubspotMeeting'
import { LmButtonList } from './button-list/ButtonList'
import { LmSection } from './section/Section'
import { LmHeadline } from './headline/Headline'
// import { LmParagraph } from './paragraph/Paragraph'
import { LmGridRow } from './section/GridRow'
import { LmGridColumn } from './section/GridColumn'
import { LmImage } from './image/ImageElement'
import { LmImageList } from './image-list/ImageList'
import { LmImageListItem } from './image-list/ImageListItem'
import { LmButton } from './button/Button'
import { LmNavList } from './nav-list/NavList'
import { LmMenu } from './menu/NavMenu'
import { LmIcon } from './icon/Icon'
import { LmIframe } from './iframe/Iframe'
import { LmCardList } from './card/CardList'
import { LmCardListItem } from './card/CardListItem'
import { LmSectionParallax } from './section/SectionParallax'
import { LmListWidget } from './list-widget/ListWidget'
import { LmFlexRow } from './flex-row/FlexRow'
import { LmIframeAdvanced } from './iframe/IframeAdvanced'
import { LmCategoryBox } from './list-widget/CategoryBox'
import { LmListSearchField } from './list-widget/ListSearchField'
import { LmLink } from './link/Link'
import { LmListSearchAutocomplete } from './list-widget/ListSearchAutocomplete'
import { LmRichTextParagraph } from './paragraph/RichTextParagraph'
import { LmAvatar } from './avatar/LmAvatar'
import { LmDateHeadline } from './headline/DateHeadline'
import { LmMotion } from './motion/Motion'
import { LmToolbarLogo } from './layout/toolbar/ToolbarLogo'
import { LmToggleDrawerButton } from './layout/toolbar/ToggleDrawerButton'
import { LmToolbarSection } from './layout/toolbar/ToolbarSection'
import { LmDialog } from './dialog/Dialog'
import { LmInstagramPost } from './instagram/InstagramPost'
import { LmInstagramList } from './instagram/InstagramList'
import { LmCoreComponents } from '../utils/config'
import MuiNextLink from './link/MuiNextLink'
import { TawktoChatButton } from './chat/TawktoChatButton'
import { WhatsappChatButton } from './chat/WhatsappChatButton'
import { FacebookChatButton } from './chat/FacebookChatButton'
import { LmSnackbar } from './snackbar/Snackbar'
import { LmToolbarRow } from './layout/toolbar/ToolbarRow'

LmCoreComponents.page = LmPage
LmCoreComponents.table = LmTable
LmCoreComponents.accordion = dynamic(
  () => import(/* webpackChunkName: 'accordion' */ './accordion/Accordion')
)
LmCoreComponents.accordion_item = dynamic(
  () => import(/* webpackChunkName: 'accordion' */ './accordion/AccordionItem')
)
LmCoreComponents.static_section = LmStaticSection
LmCoreComponents.static_container = LmStaticContainer
LmCoreComponents.divider = LmDivider
LmCoreComponents.html = LmHtml
LmCoreComponents.hubspot_meeting = LmHubspotMeeting
LmCoreComponents.button_list = LmButtonList
LmCoreComponents.section = LmSection
LmCoreComponents.headline = LmHeadline
// LmCoreComponents.paragraph = LmParagraph
LmCoreComponents.row = LmGridRow
LmCoreComponents.column = LmGridColumn
LmCoreComponents.image = LmImage
LmCoreComponents.image_list = LmImageList
LmCoreComponents.image_list_item = LmImageListItem
LmCoreComponents.button = LmButton
LmCoreComponents.nav_list = LmNavList
LmCoreComponents.nav_menu = LmMenu
LmCoreComponents.icon = LmIcon
LmCoreComponents.iframe = LmIframe
LmCoreComponents.slider = dynamic(
  () => import(/* webpackChunkName: 'slider' */ './slider/Slider')
)
LmCoreComponents.section_video_bg = dynamic(
  () => import(/* webpackChunkName: 'videoPlayer' */ './section/SectionVideoBg')
)
LmCoreComponents.card_list = LmCardList
LmCoreComponents.card_list_item = LmCardListItem
LmCoreComponents.section_parallax = LmSectionParallax
LmCoreComponents.tabs = dynamic(
  () => import(/* webpackChunkName: 'tabs' */ './tabs/Tabs')
)
LmCoreComponents.list_widget = LmListWidget
LmCoreComponents.flex_row = LmFlexRow
LmCoreComponents.iframe_advanced = LmIframeAdvanced
LmCoreComponents.category_box = LmCategoryBox
LmCoreComponents.list_search_field = LmListSearchField
LmCoreComponents.link = LmLink
LmCoreComponents.list_search_autocomplete = LmListSearchAutocomplete
LmCoreComponents.rich_text_editor = LmRichTextParagraph
LmCoreComponents.timeline = dynamic(
  () => import(/* webpackChunkName: 'timeline' */ './timeline/Timeline')
)
LmCoreComponents.timeline_item = dynamic(
  () => import(/* webpackChunkName: 'timeline' */ './timeline/TimelineItem')
)
LmCoreComponents.avatar = LmAvatar
LmCoreComponents.date_headline = LmDateHeadline
LmCoreComponents.motion = LmMotion
LmCoreComponents.toolbar_logo = LmToolbarLogo
LmCoreComponents.toolbar_navi_button = LmToggleDrawerButton
LmCoreComponents.player = dynamic(
  () => import(/* webpackChunkName: 'videoPlayer' */ './player/Player')
)
LmCoreComponents.toolbar_row_section = LmToolbarSection
LmCoreComponents.toolbar_row = LmToolbarRow
LmCoreComponents.dialog = LmDialog
LmCoreComponents.instagram_post = LmInstagramPost
LmCoreComponents.instagram_list = LmInstagramList
LmCoreComponents.lm_link_render = MuiNextLink
LmCoreComponents.chat_tawkto = TawktoChatButton
LmCoreComponents.chat_whatsapp = WhatsappChatButton
LmCoreComponents.chat_facebook = FacebookChatButton
LmCoreComponents.snackbar = LmSnackbar

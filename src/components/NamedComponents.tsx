import { LmCoreComponents } from '@CONFIG'
import { LmStaticSection } from './static-section/StaticSection'
import { LmStaticContainer } from './static-section/StaticContainer'
import { LmDivider } from './divider/Divider'
import { LmHtml } from './html/Html'
import { LmButtonList } from './button-list/ButtonList'
import { LmSection } from './section/Section'
import { LmHeadline } from './headline/Headline'
import { LmGridRow } from './section/GridRow'
import { LmGridColumn } from './section/GridColumn'
import { LmButton } from './button/Button'
import { LmNavList } from './nav-list/NavList'
import { LmMenu } from './menu/NavMenu'
import { LmIcon } from './icon/Icon'
import { LmFlexRow } from './flex-row/FlexRow'
import { LmLink } from './link/Link'
import { LmRichTextParagraph } from './paragraph/RichTextParagraph'
import { LmAvatar } from './avatar/LmAvatar'
import { LmDateHeadline } from './headline/DateHeadline'
import { LmToolbarLogo } from './layout/toolbar/ToolbarLogo'
import { LmToggleDrawerButton } from './layout/toolbar/ToggleDrawerButton'
import { LmToolbarSection } from './layout/toolbar/ToolbarSection'
import MuiNextLink from './link/MuiNextLink'
import { LmToolbarRow } from './layout/toolbar/ToolbarRow'
import { LmImageElement } from './image/ImageElement'
import LmGoogleFormContainer from './google-form/LmGoogleFormContainer'
import LmIframe from './iframe/Iframe'
import LmWhatsappChatButton from './chat/WhatsappChatButton'
import LmFacebookChatButton from './chat/FacebookChatButton'
import LmTawktoChatButton from './chat/TawktoChatButton'
import LmDialogElement from './dialog/DialogElement'
import LmNews from './news/News'
import LmEvent from './event/Event'
import LmNavItem from './nav-list/NavItem'
import LmCardStandalone from './card/CardStandalone'

LmCoreComponents.static_section = LmStaticSection
LmCoreComponents.static_container = LmStaticContainer
LmCoreComponents.divider = LmDivider
LmCoreComponents.html = LmHtml
LmCoreComponents.button_list = LmButtonList
LmCoreComponents.section = LmSection
LmCoreComponents.headline = LmHeadline
LmCoreComponents.row = LmGridRow
LmCoreComponents.column = LmGridColumn
LmCoreComponents.image = LmImageElement
LmCoreComponents.button = LmButton
LmCoreComponents.nav_list = LmNavList
LmCoreComponents.nav_item = LmNavItem
LmCoreComponents.nav_menu = LmMenu
LmCoreComponents.icon = LmIcon
LmCoreComponents.flex_row = LmFlexRow
LmCoreComponents.link = LmLink
LmCoreComponents.rich_text_editor = LmRichTextParagraph
LmCoreComponents.avatar = LmAvatar
LmCoreComponents.date_headline = LmDateHeadline
LmCoreComponents.toolbar_logo = LmToolbarLogo
LmCoreComponents.toolbar_navi_button = LmToggleDrawerButton
LmCoreComponents.toolbar_row_section = LmToolbarSection
LmCoreComponents.toolbar_row = LmToolbarRow
LmCoreComponents.lm_link_render = MuiNextLink
LmCoreComponents.form = LmGoogleFormContainer
// moving components back
LmCoreComponents.iframe = LmIframe
// eslint-disable-next-line
// @ts-ignore
LmCoreComponents.iframe_advanced = LmIframe
LmCoreComponents.chat_tawkto = LmTawktoChatButton
LmCoreComponents.chat_facebook = LmFacebookChatButton
LmCoreComponents.chat_whatsapp = LmWhatsappChatButton
LmCoreComponents.dialog = LmDialogElement
LmCoreComponents.news = LmNews
LmCoreComponents.event = LmEvent
LmCoreComponents.card = LmCardStandalone

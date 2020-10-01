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


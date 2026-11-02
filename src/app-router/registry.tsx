'use client'

import dynamic from 'next/dynamic'
import { registerStoryblokComponents } from '../utils/config'
import { LmSection } from '../components/section/Section'
import { LmGridRow } from '../components/section/GridRow'
import { LmGridColumn } from '../components/section/GridColumn'
import { LmFlexRow } from '../components/flex-row/FlexRow'
import { LmHeadline } from '../components/headline/Headline'
import { LmButton } from '../components/button/Button'
import { LmButtonList } from '../components/button-list/ButtonList'
import { LmMenu } from '../components/menu/NavMenu'
import { LmToolbarLogo } from '../components/layout/toolbar/ToolbarLogo'
import { LmToggleDrawerButton } from '../components/layout/toolbar/ToggleDrawerButton'
import { LmToolbarSection } from '../components/layout/toolbar/ToolbarSection'
import { LmToolbarRow } from '../components/layout/toolbar/ToolbarRow'
import { LmDateHeadline } from '../components/headline/DateHeadline'
import { LmDivider } from '../components/divider/Divider'
import MuiNextLink from '../components/link/MuiNextLink'

// Explicit pilot registry. Expanding the supported CMS vocabulary is deliberate;
// importing the Pages registry here would pull all public renderers into JS.
const Iframe = dynamic(() => import('../components/iframe/Iframe'))
registerStoryblokComponents({
  section: LmSection,
  row: LmGridRow,
  column: LmGridColumn,
  flex_row: LmFlexRow,
  headline: LmHeadline,
  button: LmButton,
  button_list: LmButtonList,
  nav_menu: LmMenu,
  toolbar_logo: LmToolbarLogo,
  toolbar_navi_button: LmToggleDrawerButton,
  toolbar_row_section: LmToolbarSection,
  toolbar_row: LmToolbarRow,
  date_headline: LmDateHeadline,
  divider: LmDivider,
  paragraph: dynamic(() => import('../components/paragraph/Paragraph')),
  rich_text_editor: dynamic(() =>
    import('../components/paragraph/RichTextParagraph').then(
      (m) => m.LmRichTextParagraph
    )
  ),
  image: dynamic(() =>
    import('../components/image/ImageElement').then((m) => m.LmImageElement)
  ),
  avatar: dynamic(() =>
    import('../components/avatar/LmAvatar').then((m) => m.LmAvatar)
  ),
  html: dynamic(() => import('../components/html/Html').then((m) => m.LmHtml)),
  iframe: (props) => <Iframe {...props} />,
  list_search_autocomplete: dynamic(
    () => import('../components/list-widget/ListSearchAutocomplete')
  ),
  snackbar: dynamic(() => import('../components/snackbar/Snackbar'))
})

// This hook belongs to the client registry rather than the server renderer.
import { CONFIG, LmCoreComponents } from '../utils/config'
LmCoreComponents.lm_link_render = (props) => (
  <MuiNextLink {...props} prefetch={CONFIG.prefetch ? props.prefetch : false} />
)

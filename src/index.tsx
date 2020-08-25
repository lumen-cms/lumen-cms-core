import React, { Attributes, ComponentClass, FC, FunctionComponentFactory, isValidElement, ReactNode } from 'react'
import SbEditable from 'storyblok-react'
import { AppProps } from 'next/app'
import { AppPageProps, ComponentRenderFuncProps } from './typings/app'
import { LmAccordion } from './components/accordion/Accordion'
import { LmPage } from './components/page/Page'
import { LmTable } from './components/table/Table'
import { LmStaticSection } from './components/static-section/StaticSection'
import { LmStaticContainer } from './components/static-section/StaticContainer'
import { LmDivider } from './components/divider/Divider'
import { LmHubspotMeeting } from './components/hubspot-meeting/HubspotMeeting'
import { LmButtonList } from './components/button-list/ButtonList'
import { LmHeadline } from './components/headline/Headline'
import { LmParagraph } from './components/paragraph/Paragraph'
import { LmGridRow } from './components/section/GridRow'
import { LmGridColumn } from './components/section/GridColumn'
import { LmImage } from './components/image/ImageElement'
import { LmHtml } from './components/html/Html'
import { LmImageList } from './components/image-list/ImageList'
import { LmButton } from './components/button/Button'
import { LmNavList } from './components/nav-list/NavList'
import { LmMenu } from './components/menu/NavMenu'
import { LmIframe } from './components/iframe/Iframe'
import { LmSlider } from './components/slider/Slider'
import { LmSectionVideo } from './components/section/SectionVideoBg'
import { LmIcon } from './components/icon/Icon'
import { LmCardList } from './components/card/CardList'
import { LmSectionParallax } from './components/section/SectionParallax'
import { LmTabs } from './components/tabs/Tabs'
import { LmListWidget } from './components/list-widget/ListWidget'
import { LmFlexRow } from './components/flex-row/FlexRow'
import { LmIframeAdvanced } from './components/iframe/IframeAdvanced'
import { LmCategoryBox } from './components/list-widget/CategoryBox'
import { LmListSearchField } from './components/list-widget/ListSearchField'
import { LmLink } from './components/link/Link'
import { LmListSearchAutocomplete } from './components/list-widget/ListSearchAutocomplete'
import { LmRichTextParagraph } from './components/paragraph/RichTextParagraph'
import { LmTimeline } from './components/timeline/Timeline'
import { LmAvatar } from './components/avatar/LmAvatar'
import { LmDateHeadline } from './components/headline/DateHeadline'
import { LmMotion } from './components/motion/Motion'
import { LmSection } from './components/section/Section'
import { LmAccordionItem } from './components/accordion/AccordionItem'
import { LmTimelineItem } from './components/timeline/TimelineRow'
import { LmCardListItem } from './components/card/CardListItem'
import { LmImageListItem } from './components/image-list/ImageListItem'
import { LmToolbarLogo } from './components/layout/toolbar/ToolbarLogo'
import { LmDialog } from './components/dialog/Dialog'
import { LmToggleDrawerButton } from './components/layout/toolbar/ToggleDrawerButton'
import { LmApp } from './components/pages/_app'
import { LmPlayer } from './components/player/Player'
import { LmToolbarSection } from './components/layout/toolbar/ToolbarSection'
import { LmInstagramPost } from './components/instagram/InstagramPost'
import { LmInstagramList } from './components/instagram/InstagramList'
import { CONFIG } from './utils/config'

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
  LmHubspotMeeting,
  LmIcon,
  LmIframeAdvanced,
  LmIframe,
  LmImage,
  LmImageList,
  LmListWidget,
  LmListSearchField,
  LmSection,
  LmParagraph,
  LmStaticContainer,
  LmStaticSection,
  LmTimeline,
  LmGridRow,
  LmGridColumn,
  LmRichTextParagraph,
  LmListSearchAutocomplete,
  LmLink,
  LmDialog,
  LmCategoryBox,
  LmTabs,
  LmTable,
  LmSectionParallax,
  LmSlider,
  LmMenu,
  LmNavList,
  LmSectionVideo,
  LmPage,
  LmMotion,
  LmAccordionItem,
  LmCardListItem,
  LmImageListItem,
  LmToolbarLogo,
  LmToggleDrawerButton,
  LmPlayer,
  LmToolbarSection,
  LmInstagramPost,
  LmInstagramList
}

export { LmPagesIndex as LmDefaultPage } from './components/pages/PagesIndex'
export { LmApp }
export { default as LmStoryblokService } from './utils/StoryblokService'
export { internalLinkHandler } from './utils/linkHandler'
export { default as LmAppProvider } from './components/provider/AppProvider'
export { AppContainer as LmAppContainer } from './components/layout/AppContainer'
export { useAppContext } from './components/provider/context/AppContext'
export { default as LmWindowDimensionProvider } from './components/provider/WindowDimensionsProvider'
export { useWindowDimensions } from './components/provider/context/WindowDimensionContext'
export { default as LmAppSetupProvider } from './components/provider/AppSetupProvider'
export { useAppSetup } from './components/provider/context/AppSetupContext'
export { default as useScript } from './utils/hooks/useScript'
export type { ScriptStatus } from './utils/hooks/useScript'
export { CONFIG }

export type LmCoreComponentsType = { [k: string]: ReactNode | null }
export const LmCoreComponents: LmCoreComponentsType = {
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

export function LmDefaultApp(props: AppProps<AppPageProps>) {
  const ComponentRender = props.pageProps.insideStoryblok
    ? LmStoryblokComponentRender
    : LmComponentRender
  return (
    <LmApp
      {...props}
      ComponentRender={ComponentRender as FunctionComponentFactory<any>}
    />
  )
}

export function LmStoryblokComponentRender<P>(
  props: ComponentRenderFuncProps
): JSX.Element {
  const { content, i, ...rest } = props
  if (typeof LmCoreComponents[content.component] !== 'undefined') {
    const CurrentElement = React.createElement(
      LmCoreComponents[content.component] as FC<P> | ComponentClass<P>,
      {
        content,
        ...rest
      } as unknown as Attributes & P
    )
    if (isValidElement(CurrentElement)) {
      return (
        <SbEditable
          content={content}
          key={typeof i === 'number' ? `${content.component}_${content._uid || i}` : undefined}
        >
          {CurrentElement}
        </SbEditable>
      )
    }
    console.log(
      `element is not valid for SbEditable ${content.component} ${content._uid}`
    )

    return CurrentElement
  }
  return (
    <div style={{ color: 'red' }} key={content?._uid || `${i}`}>
      The component {content.component || 'no name found'} has not been created
      yet.
    </div>
  )
}

export function LmComponentRender<P>(
  props: ComponentRenderFuncProps
): JSX.Element {
  const { content, i, ...rest } = props

  if (typeof LmCoreComponents[content.component] !== 'undefined') {
    return React.createElement(
      LmCoreComponents[content.component] as FC<P> | ComponentClass<P>,
      {
        content,
        key: typeof i === 'number' ? `${content.component}_${content._uid || i}` : undefined,
        ...rest
      } as unknown as Attributes & P
    )
  }
  return (
    <div style={{ color: 'red' }} key={content?._uid || `${i}`}>
      The component {content.component || 'no name found'} has not been created
      yet.
    </div>
  )
}

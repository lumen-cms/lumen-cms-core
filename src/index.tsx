import React, { FunctionComponentFactory, isValidElement } from 'react'
import SbEditable from 'storyblok-react'
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
import { LmToggleDrawerButton } from './components/layout/toolbar/ToggleDrawerButton'
import { LmApp } from './components/pages/_app'
import { AppProps } from 'next/app'


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
  LmToggleDrawerButton
}

export { LmPagesIndex as LmDefaultPage } from './components/pages/PagesIndex'
export { LmApp }
export { default as LmStoryblokService } from './utils/StoryblokService'
export { internalLinkHandler } from './utils/linkHandler'
export { useAppContext } from './components/provider/AppProvider'
export { useWindowDimensions } from './components/provider/WindowDimensionsProvider'
export { useAppSetup } from './components/provider/AppSetupProvider'
export { CONFIG } from './utils/config'

export const LmCoreComponentsNamed = {
  'page': LmPage,
  'table': LmTable,
  'accordion': LmAccordion,
  'accordion_item': LmAccordionItem,
  'static_section': LmStaticSection,
  'static_container': LmStaticContainer,
  'divider': LmDivider,
  'html': LmHtml,
  'hubspot_meeting': LmHubspotMeeting,
  'button_list': LmButtonList,
  'section': LmSection,
  'headline': LmHeadline,
  'paragraph': LmParagraph,
  'row': LmGridRow,
  'column': LmGridColumn,
  'image': LmImage,
  'image_list': LmImageList,
  'image_list_item': LmImageListItem,
  'button': LmButton,
  'nav_list': LmNavList,
  'nav_menu': LmMenu,
  'icon': LmIcon,
  'iframe': LmIframe,
  'slider': LmSlider,
  'section_video_bg': LmSectionVideo,
  'card_list': LmCardList,
  'card_list_item': LmCardListItem,
  'section_parallax': LmSectionParallax,
  'tabs': LmTabs,
  'list_widget': LmListWidget,
  'flex_row': LmFlexRow,
  'iframe_advanced': LmIframeAdvanced,
  'category_box': LmCategoryBox,
  'list_search_field': LmListSearchField,
  'link': LmLink,
  'list_search_autocomplete': LmListSearchAutocomplete,
  'rich_text_editor': LmRichTextParagraph,
  'timeline': LmTimeline,
  'timeline_item': LmTimelineItem,
  'avatar': LmAvatar,
  'date_headline': LmDateHeadline,
  'motion': LmMotion,
  'toolbar_logo': LmToolbarLogo,
  'toolbar_navi_button': LmToggleDrawerButton
}

export function LmDefaultApp(props: AppProps<AppPageProps>) {
  const ComponentRender = props.pageProps.insideStoryblok ? LmStoryblokComponentRender : LmComponentRender
  return <LmApp {...props} ComponentRender={ComponentRender as FunctionComponentFactory<any>} />
}


export function LmStoryblokComponentRender(props: ComponentRenderFuncProps): JSX.Element {
  const { content, i, ...rest } = props
  if (typeof LmCoreComponentsNamed[content.component] !== 'undefined') {
    const CurrentElement = React.createElement(LmCoreComponentsNamed[content.component], {
      content: content,
      ...rest
    })
    if (isValidElement(CurrentElement)) {
      return (
        <SbEditable content={content} key={typeof i === 'number' ? `${content.component}_${i}` : undefined}>
          {CurrentElement}
        </SbEditable>
      )
    } else {
      console.log(`element is not valid for SbEditable ${content.component} ${content._uid}`)
    }
    return CurrentElement
  }
  return (
    <div style={{ color: 'red' }} key={content?._uid || `${i}`}>The
      component {content.component || 'no name found'} has not been
      created yet.</div>
  )
}

export function LmComponentRender(props: ComponentRenderFuncProps): JSX.Element {
  const { content, i, ...rest } = props

  if (typeof LmCoreComponentsNamed[content.component] !== 'undefined') {
    return React.createElement(LmCoreComponentsNamed[content.component], {
      content: content,
      key: typeof i === 'number' ? `${content.component}_${i}` : undefined,
      ...rest
    })
  }
  return (
    <div style={{ color: 'red' }} key={content?._uid || `${i}`}>The
      component {content.component || 'no name found'} has not been
      created yet.</div>
  )
}

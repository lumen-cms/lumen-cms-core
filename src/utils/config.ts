import { FC, JSXElementConstructor, PropsWithChildren, ReactNode } from 'react'
import {
  LmTimelineItemProps,
  LmTimelineProps
} from '../components/timeline/timelineTypes'
import {
  LmAccordionItemProps,
  LmAccordionProps
} from '../components/accordion/accordionTypes'
import { LmAvatarProps } from '../components/avatar/avatarTypes'
import { LmButtonProps } from '../components/button/buttonTypes'
import { LmButtonListProps } from '../components/button-list/buttonListTypes'
import {
  CardListItemProps,
  LmCardListProps
} from '../components/card/cardTypes'
import { LmDialogProps } from '../components/dialog/dialogTypes'
import { LmDividerProps } from '../components/divider/dividerTypes'
import { LmFlexRowProps } from '../components/flex-row/flexRowTypes'
import {
  LmDateHeadlineProps,
  LmHeadlineProps
} from '../components/headline/headlineTypes'
import { LmHtmlProps } from '../components/html/htmlTypes'
import {
  LmHubspotFormProps,
  LmHubspotMeetingProps
} from '../components/hubspot-meeting/hubspotTypes'
import { LmIconProps } from '../components/icon/iconTypes'
import {
  LmIframeAdvancedProps,
  LmIframeProps
} from '../components/iframe/iframeTypes'
import { LmImageProps } from '../components/image/imageTypes'
import {
  LmImageListItemProps,
  LmImageListProps
} from '../components/image-list/imageListTypes'
import { LinkProps, LmLinkProps } from '../components/link/linkTypes'
import {
  LmCategoryBoxProps,
  LmListSearchAutocompleteProps,
  LmListSearchFieldProps,
  LmListWidgetProps
} from '../components/list-widget/listWidgetTypes'
import { LmMenuProps } from '../components/menu/menuTypes'
import { LmMotionProps } from '../components/motion/motionTypes'
import {
  LmNavItemProps,
  LmNavListProps
} from '../components/nav-list/navListTypes'
import { LmPageProps } from '../components/page/pageTypes'
import {
  LmParagraphProps,
  LmRichTextParagraphProps
} from '../components/paragraph/paragraphTypes'
import { LmPlayerProps } from '../components/player/playerTypes'
import {
  LmGridColumnProps,
  LmGridRowProps,
  LmSectionParallaxProps,
  LmSectionProps,
  LmSectionVideoProps
} from '../components/section/sectionTypes'
import { LmSliderProps } from '../components/slider/sliderTypes'
import {
  LmStaticContainerProps,
  LmStaticSectionProps
} from '../components/static-section/staticTypes'
import { LmTableProps } from '../components/table/tableTypes'
import { LmTabsProps } from '../components/tabs/tabsTypes'
import {
  LmToggleDrawerButtonProps,
  LmToolbarLogoProps,
  LmToolbarRowProps,
  LmToolbarSectionProps
} from '../components/layout/toolbar/toolbarTypes'
import type { BigNumber, Contract } from 'ethers'
import { MoralisMintProps } from '../components/web3/moralisTypings'

type AppConfigProps = {
  publicToken: string
  previewToken: string
  rootDirectory?: string
  overwriteLocale?: string
  enableLocaleSuffix?: boolean
  fieldLevelTranslation?: boolean
  suppressSlugLocale?: boolean
  suppressSlugIncludeDefault?: boolean
  overwriteDisableIndex?: boolean
  GA?: string
  TAWKTO?: string
  prefetch: boolean
  hostname?: string
  excluding_slugs?: string // exclude slugs for sitemap, getStaticPaths. wildcards allowed: "auth/*,demo-content/*"
  overwriteSettingsPaths: string[] // overwrite paths which are in route, add trailing slash: some/special/,other/special/
  languages: string[]
  authPathRequiredRoles?: {
    path: string
    roles: string[]
  }[]
  shopifyGql: string
  shopifyAccessToken: string
  web3MintFunction: (
    contract: Contract,
    options: {
      mintAmount: number
      sale: MoralisMintProps['content']['sale']
      account: string
      maxMintAmount?: number
      signed?: string
      value?: BigNumber | 0
      code?: string
    }
  ) => Promise<void>
  [k: string]: any
}

export const CONFIG: AppConfigProps = {
  previewToken: process.env.NEXT_PUBLIC_PREVIEW_TOKEN || '',
  publicToken:
    (process.env.NEXT_PUBLIC_PREVIEW_MODE
      ? process.env.NEXT_PUBLIC_PREVIEW_TOKEN
      : process.env.NEXT_PUBLIC_PUBLIC_TOKEN) || '',
  rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
  enableLocaleSuffix: !!process.env.NEXT_PUBLIC_ENABLE_LOCALE_SUFFIX,
  fieldLevelTranslation: !!process.env.NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION,
  overwriteLocale: process.env.NEXT_PUBLIC_OVERWRITE_LOCALE,
  suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE, // only in combination with NEXT_PUBLIC_LANGUAGES
  overwriteDisableIndex: !!process.env.NEXT_PUBLIC_OVERWRITE_DISABLE_INDEX,
  GA: process.env.NEXT_PUBLIC_GA,
  languages: process.env.NEXT_PUBLIC_LANGUAGES?.split(',') || [],
  TAWKTO: process.env.NEXT_PUBLIC_TAWKTO,
  prefetch: !process.env.NEXT_PUBLIC_DISABLE_PREFETCH,
  overwriteSettingsPaths:
    process.env.NEXT_PUBLIC_OVERWRITE_SETTINGS_PATHS?.split(',') || [],
  excluding_slugs: process.env.NEXT_PUBLIC_EXCLUDING_SLUGS || '',
  shopifyGql: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2020-10/graphql.json`
    : '',
  shopifyAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || '',
  web3MintFunction: async () => {
    throw new Error('You must overwrite CONFIG.web3MintFunction inside _app')
  }
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
  hubspot_form?: JSXElementConstructor<LmHubspotFormProps>
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
  nav_item?: JSXElementConstructor<LmNavItemProps>
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
  // eslint-disable-next-line
  list_search_autocomplete?: JSXElementConstructor<LmListSearchAutocompleteProps>
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
  toolbar_row?: JSXElementConstructor<LmToolbarRowProps>
  dialog?: JSXElementConstructor<LmDialogProps>
  lm_link_render?: JSXElementConstructor<LinkProps>
  lm_app_providers: FC<PropsWithChildren<any>>[]
  parallax_provider?: JSXElementConstructor<any>
  [k: string]: ReactNode | null
}

export const LmCoreComponents: LmCoreComponentsProps = {
  lm_app_providers: []
}

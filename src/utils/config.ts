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
  // page?: ReactElement<LmPageProps>
  // accordion?: (props: LmAccordionProps) => ReactNode
  // accordion_item?: (props: LmAccordionItemProps) => ReactNode
  // table?: FunctionComponentFactory<LmTableProps>
  // static_section?: ReactElement<LmStaticSectionProps>
  // static_container?: ReactElement<LmStaticContainerProps>
  // divider?: ReactElement<LmDividerProps>
  // html?: ReactElement<LmHtmlProps>
  // hubspot_meeting?: ReactElement<LmHubspotMeetingProps>
  // hubspot_form?: ReactElement<LmHubspotFormProps>
  // button_list?: ReactElement<LmButtonListProps>
  // section?: ReactElement<LmSectionProps>
  // headline?: ReactElement<LmHeadlineProps>
  // paragraph?: ReactElement<LmParagraphProps>
  // row?: ReactElement<LmGridRowProps>
  // column?: ReactElement<LmGridColumnProps>
  // image?: ReactElement<LmImageProps>
  // image_list?: ReactElement<LmImageListProps>
  // image_list_item?: ReactElement<LmImageListItemProps>
  // button?: ReactElement<LmButtonProps>
  // nav_list?: ReactElement<LmNavListProps>
  // nav_item?: ReactElement<LmNavItemProps>
  // nav_menu?: ReactElement<LmMenuProps>
  // icon?: ReactElement<LmIconProps>
  // iframe?: ReactElement<LmIframeProps>
  // slider?: ReactElement<LmSliderProps>
  // section_video_bg?: ReactElement<LmSectionVideoProps>
  // card_list?: ReactElement<LmCardListProps>
  // card_list_item?: ReactElement<CardListItemProps>
  // section_parallax?: ReactElement<LmSectionParallaxProps>
  // tabs?: ReactElement<LmTabsProps>
  // list_widget?: ReactElement<LmListWidgetProps>
  // flex_row?: ReactElement<LmFlexRowProps>
  // iframe_advanced?: ReactElement<LmIframeAdvancedProps>
  // category_box?: ReactElement<LmCategoryBoxProps>
  // list_search_field?: ReactElement<LmListSearchFieldProps>
  // link?: ReactElement<LmLinkProps>
  // // eslint-disable-next-line
  // list_search_autocomplete?: ReactElement<LmListSearchAutocompleteProps>
  // rich_text_editor?: ReactElement<LmRichTextParagraphProps>
  // timeline?: FunctionComponentElement<any>
  // timeline_item?: ReactElement<LmTimelineItemProps>
  // avatar?: ReactElement<LmAvatarProps>
  // date_headline?: ReactElement<LmDateHeadlineProps>
  // motion?: ReactElement<LmMotionProps>
  // toolbar_logo?: ReactElement<LmToolbarLogoProps>
  // toolbar_navi_button?: ReactElement<LmToggleDrawerButtonProps>
  // player?: ReactElement<LmPlayerProps>
  // toolbar_row_section?: ReactElement<LmToolbarSectionProps>
  // toolbar_row?: ReactElement<LmToolbarRowProps>
  // dialog?: ReactElement<LmDialogProps>
  // lm_link_render?: ReactElement<LinkProps>
  // lm_app_providers: ReactNode[]
  // parallax_provider?: ReactElement<any>
  [k: string]: any
}

export const LmCoreComponents: LmCoreComponentsProps = {
  lm_app_providers: []
}

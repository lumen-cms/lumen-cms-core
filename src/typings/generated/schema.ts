export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  JsonScalar: any
  BlockScalar: any
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any
}

export type QueryType = {
  __typename?: 'QueryType'
  CategoryItem?: Maybe<CategoryItem>
  CategoryItems?: Maybe<CategoryItems>
  ContentNode?: Maybe<ContentItem>
  ContentNodes?: Maybe<ContentItems>
  DatasourceEntries?: Maybe<DatasourceEntries>
  Datasources?: Maybe<Datasources>
  ErrorpageItem?: Maybe<ErrorpageItem>
  ErrorpageItems?: Maybe<ErrorpageItems>
  GlobalItem?: Maybe<GlobalItem>
  GlobalItems?: Maybe<GlobalItems>
  PageItem?: Maybe<PageItem>
  PageItems?: Maybe<PageItems>
  Space?: Maybe<Space>
  StaticcontainerItem?: Maybe<StaticcontainerItem>
  StaticcontainerItems?: Maybe<StaticcontainerItems>
  Tags?: Maybe<Tags>
}

export type QueryTypeCategoryItemArgs = {
  id: Scalars['ID']
  find_by?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['Int']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
}

export type QueryTypeCategoryItemsArgs = {
  first_published_at_gt?: Maybe<Scalars['String']>
  first_published_at_lt?: Maybe<Scalars['String']>
  starts_with?: Maybe<Scalars['String']>
  by_slugs?: Maybe<Scalars['String']>
  by_uuids?: Maybe<Scalars['String']>
  by_uuids_ordered?: Maybe<Scalars['String']>
  excluding_ids?: Maybe<Scalars['String']>
  excluding_fields?: Maybe<Scalars['String']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['String']>
  sort_by?: Maybe<Scalars['String']>
  search_term?: Maybe<Scalars['String']>
  is_startpage?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
  with_tag?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  per_page?: Maybe<Scalars['Int']>
  filter_query?: Maybe<Scalars['JsonScalar']>
  filter_query_v2?: Maybe<CategoryFilterQuery>
}

export type QueryTypeContentNodeArgs = {
  id: Scalars['ID']
  find_by?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['Int']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
}

export type QueryTypeContentNodesArgs = {
  first_published_at_gt?: Maybe<Scalars['String']>
  first_published_at_lt?: Maybe<Scalars['String']>
  starts_with?: Maybe<Scalars['String']>
  by_slugs?: Maybe<Scalars['String']>
  by_uuids?: Maybe<Scalars['String']>
  by_uuids_ordered?: Maybe<Scalars['String']>
  excluding_ids?: Maybe<Scalars['String']>
  excluding_fields?: Maybe<Scalars['String']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['String']>
  sort_by?: Maybe<Scalars['String']>
  search_term?: Maybe<Scalars['String']>
  is_startpage?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
  with_tag?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  per_page?: Maybe<Scalars['Int']>
  filter_query?: Maybe<Scalars['JsonScalar']>
}

export type QueryTypeDatasourceEntriesArgs = {
  datasource?: Maybe<Scalars['String']>
  dimension?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  per_page?: Maybe<Scalars['Int']>
}

export type QueryTypeDatasourcesArgs = {
  search?: Maybe<Scalars['String']>
  by_ids?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type QueryTypeErrorpageItemArgs = {
  id: Scalars['ID']
  find_by?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['Int']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
}

export type QueryTypeErrorpageItemsArgs = {
  first_published_at_gt?: Maybe<Scalars['String']>
  first_published_at_lt?: Maybe<Scalars['String']>
  starts_with?: Maybe<Scalars['String']>
  by_slugs?: Maybe<Scalars['String']>
  by_uuids?: Maybe<Scalars['String']>
  by_uuids_ordered?: Maybe<Scalars['String']>
  excluding_ids?: Maybe<Scalars['String']>
  excluding_fields?: Maybe<Scalars['String']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['String']>
  sort_by?: Maybe<Scalars['String']>
  search_term?: Maybe<Scalars['String']>
  is_startpage?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
  with_tag?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  per_page?: Maybe<Scalars['Int']>
  filter_query?: Maybe<Scalars['JsonScalar']>
  filter_query_v2?: Maybe<ErrorpageFilterQuery>
}

export type QueryTypeGlobalItemArgs = {
  id: Scalars['ID']
  find_by?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['Int']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
}

export type QueryTypeGlobalItemsArgs = {
  first_published_at_gt?: Maybe<Scalars['String']>
  first_published_at_lt?: Maybe<Scalars['String']>
  starts_with?: Maybe<Scalars['String']>
  by_slugs?: Maybe<Scalars['String']>
  by_uuids?: Maybe<Scalars['String']>
  by_uuids_ordered?: Maybe<Scalars['String']>
  excluding_ids?: Maybe<Scalars['String']>
  excluding_fields?: Maybe<Scalars['String']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['String']>
  sort_by?: Maybe<Scalars['String']>
  search_term?: Maybe<Scalars['String']>
  is_startpage?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
  with_tag?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  per_page?: Maybe<Scalars['Int']>
  filter_query?: Maybe<Scalars['JsonScalar']>
  filter_query_v2?: Maybe<GlobalFilterQuery>
}

export type QueryTypePageItemArgs = {
  id: Scalars['ID']
  find_by?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['Int']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
}

export type QueryTypePageItemsArgs = {
  first_published_at_gt?: Maybe<Scalars['String']>
  first_published_at_lt?: Maybe<Scalars['String']>
  starts_with?: Maybe<Scalars['String']>
  by_slugs?: Maybe<Scalars['String']>
  by_uuids?: Maybe<Scalars['String']>
  by_uuids_ordered?: Maybe<Scalars['String']>
  excluding_ids?: Maybe<Scalars['String']>
  excluding_fields?: Maybe<Scalars['String']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['String']>
  sort_by?: Maybe<Scalars['String']>
  search_term?: Maybe<Scalars['String']>
  is_startpage?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
  with_tag?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  per_page?: Maybe<Scalars['Int']>
  filter_query?: Maybe<Scalars['JsonScalar']>
  filter_query_v2?: Maybe<PageFilterQuery>
}

export type QueryTypeStaticcontainerItemArgs = {
  id: Scalars['ID']
  find_by?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['Int']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
}

export type QueryTypeStaticcontainerItemsArgs = {
  first_published_at_gt?: Maybe<Scalars['String']>
  first_published_at_lt?: Maybe<Scalars['String']>
  starts_with?: Maybe<Scalars['String']>
  by_slugs?: Maybe<Scalars['String']>
  by_uuids?: Maybe<Scalars['String']>
  by_uuids_ordered?: Maybe<Scalars['String']>
  excluding_ids?: Maybe<Scalars['String']>
  excluding_fields?: Maybe<Scalars['String']>
  resolve_links?: Maybe<Scalars['String']>
  resolve_relations?: Maybe<Scalars['String']>
  from_release?: Maybe<Scalars['String']>
  sort_by?: Maybe<Scalars['String']>
  search_term?: Maybe<Scalars['String']>
  is_startpage?: Maybe<Scalars['String']>
  language?: Maybe<Scalars['String']>
  with_tag?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  per_page?: Maybe<Scalars['Int']>
  filter_query?: Maybe<Scalars['JsonScalar']>
}

export type QueryTypeTagsArgs = {
  starts_with?: Maybe<Scalars['String']>
}

export type ErrorpageItem = {
  __typename?: 'ErrorpageItem'
  alternates?: Maybe<Array<Maybe<Alternate>>>
  content?: Maybe<ErrorpageComponent>
  created_at?: Maybe<Scalars['String']>
  first_published_at?: Maybe<Scalars['String']>
  full_slug?: Maybe<Scalars['String']>
  group_id?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
  is_startpage?: Maybe<Scalars['Boolean']>
  lang?: Maybe<Scalars['String']>
  meta_data?: Maybe<Scalars['JsonScalar']>
  name?: Maybe<Scalars['String']>
  parent_id?: Maybe<Scalars['Int']>
  path?: Maybe<Scalars['String']>
  position?: Maybe<Scalars['Int']>
  published_at?: Maybe<Scalars['String']>
  release_id?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  sort_by_date?: Maybe<Scalars['String']>
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>
  uuid?: Maybe<Scalars['String']>
}

export type Alternate = {
  __typename?: 'Alternate'
  fullSlug: Scalars['String']
  id: Scalars['Int']
  isFolder?: Maybe<Scalars['Boolean']>
  name: Scalars['String']
  parentId?: Maybe<Scalars['Int']>
  published: Scalars['Boolean']
  slug: Scalars['String']
}

export type TranslatedSlug = {
  __typename?: 'TranslatedSlug'
  lang: Scalars['String']
  name?: Maybe<Scalars['String']>
  path?: Maybe<Scalars['String']>
}

export type ErrorpageComponent = {
  __typename?: 'ErrorpageComponent'
  _editable?: Maybe<Scalars['String']>
  _uid?: Maybe<Scalars['String']>
  body?: Maybe<Scalars['BlockScalar']>
  component?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type ErrorpageItems = {
  __typename?: 'ErrorpageItems'
  items?: Maybe<Array<Maybe<ErrorpageItem>>>
  total?: Maybe<Scalars['Int']>
}

export type ErrorpageFilterQuery = {
  title?: Maybe<FilterQueryOperations>
}

export type FilterQueryOperations = {
  /** Matches exactly one value */
  in?: Maybe<Scalars['String']>
  /** Matches all without the given value */
  not_in?: Maybe<Scalars['String']>
  /** Matches exactly one value with a wildcard search using * */
  like?: Maybe<Scalars['String']>
  /** Matches all without the given value */
  not_like?: Maybe<Scalars['String']>
  /** Matches any value of given array */
  in_array?: Maybe<Array<Maybe<Scalars['String']>>>
  /** Must match all values of given array */
  all_in_array?: Maybe<Array<Maybe<Scalars['String']>>>
  /** Greater than date (Exmples: 2019-03-03 or 2020-03-03T03:03:03) */
  gt_date?: Maybe<Scalars['ISO8601DateTime']>
  /** Less than date (Format: 2019-03-03 or 2020-03-03T03:03:03) */
  lt_date?: Maybe<Scalars['ISO8601DateTime']>
  /** Greater than integer value */
  gt_int?: Maybe<Scalars['Int']>
  /** Less than integer value */
  lt_int?: Maybe<Scalars['Int']>
  /** Matches exactly one integer value */
  in_int?: Maybe<Scalars['Int']>
  /** Greater than float value */
  gt_float?: Maybe<Scalars['Float']>
  /** Less than float value */
  lt_float?: Maybe<Scalars['Float']>
}

export type PageItem = {
  __typename?: 'PageItem'
  alternates?: Maybe<Array<Maybe<Alternate>>>
  content?: Maybe<PageComponent>
  created_at?: Maybe<Scalars['String']>
  first_published_at?: Maybe<Scalars['String']>
  full_slug?: Maybe<Scalars['String']>
  group_id?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
  is_startpage?: Maybe<Scalars['Boolean']>
  lang?: Maybe<Scalars['String']>
  meta_data?: Maybe<Scalars['JsonScalar']>
  name?: Maybe<Scalars['String']>
  parent_id?: Maybe<Scalars['Int']>
  path?: Maybe<Scalars['String']>
  position?: Maybe<Scalars['Int']>
  published_at?: Maybe<Scalars['String']>
  release_id?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  sort_by_date?: Maybe<Scalars['String']>
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>
  uuid?: Maybe<Scalars['String']>
}

export type PageComponent = {
  __typename?: 'PageComponent'
  _editable?: Maybe<Scalars['String']>
  _uid?: Maybe<Scalars['String']>
  body?: Maybe<Scalars['BlockScalar']>
  component?: Maybe<Scalars['String']>
  meta_description?: Maybe<Scalars['String']>
  meta_robots?: Maybe<Scalars['Boolean']>
  meta_title?: Maybe<Scalars['String']>
  mobile_breakpoint?: Maybe<Scalars['String']>
  preview_image?: Maybe<Scalars['String']>
  preview_publish_date?: Maybe<Scalars['String']>
  preview_subtitle?: Maybe<Scalars['String']>
  preview_teaser?: Maybe<Scalars['String']>
  preview_title?: Maybe<Scalars['String']>
  property?: Maybe<Array<Maybe<Scalars['String']>>>
  right_body?: Maybe<Scalars['BlockScalar']>
  right_drawer_width?: Maybe<Scalars['String']>
  seo_body?: Maybe<Scalars['BlockScalar']>
}

export type PageItems = {
  __typename?: 'PageItems'
  items?: Maybe<Array<Maybe<PageItem>>>
  total?: Maybe<Scalars['Int']>
}

export type PageFilterQuery = {
  preview_title?: Maybe<FilterQueryOperations>
  preview_subtitle?: Maybe<FilterQueryOperations>
  meta_title?: Maybe<FilterQueryOperations>
  meta_robots?: Maybe<FilterQueryOperations>
  property?: Maybe<FilterQueryOperations>
  mobile_breakpoint?: Maybe<FilterQueryOperations>
  right_drawer_width?: Maybe<FilterQueryOperations>
}

export type CategoryItem = {
  __typename?: 'CategoryItem'
  alternates?: Maybe<Array<Maybe<Alternate>>>
  content?: Maybe<CategoryComponent>
  created_at?: Maybe<Scalars['String']>
  first_published_at?: Maybe<Scalars['String']>
  full_slug?: Maybe<Scalars['String']>
  group_id?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
  is_startpage?: Maybe<Scalars['Boolean']>
  lang?: Maybe<Scalars['String']>
  meta_data?: Maybe<Scalars['JsonScalar']>
  name?: Maybe<Scalars['String']>
  parent_id?: Maybe<Scalars['Int']>
  path?: Maybe<Scalars['String']>
  position?: Maybe<Scalars['Int']>
  published_at?: Maybe<Scalars['String']>
  release_id?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  sort_by_date?: Maybe<Scalars['String']>
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>
  uuid?: Maybe<Scalars['String']>
}

export type CategoryComponent = {
  __typename?: 'CategoryComponent'
  _editable?: Maybe<Scalars['String']>
  _uid?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  tag_reference?: Maybe<Scalars['JsonScalar']>
}

export type CategoryItems = {
  __typename?: 'CategoryItems'
  items?: Maybe<Array<Maybe<CategoryItem>>>
  total?: Maybe<Scalars['Int']>
}

export type CategoryFilterQuery = {
  name?: Maybe<FilterQueryOperations>
}

export type GlobalItem = {
  __typename?: 'GlobalItem'
  alternates?: Maybe<Array<Maybe<Alternate>>>
  content?: Maybe<GlobalComponent>
  created_at?: Maybe<Scalars['String']>
  first_published_at?: Maybe<Scalars['String']>
  full_slug?: Maybe<Scalars['String']>
  group_id?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
  is_startpage?: Maybe<Scalars['Boolean']>
  lang?: Maybe<Scalars['String']>
  meta_data?: Maybe<Scalars['JsonScalar']>
  name?: Maybe<Scalars['String']>
  parent_id?: Maybe<Scalars['Int']>
  path?: Maybe<Scalars['String']>
  position?: Maybe<Scalars['Int']>
  published_at?: Maybe<Scalars['String']>
  release_id?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  sort_by_date?: Maybe<Scalars['String']>
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>
  uuid?: Maybe<Scalars['String']>
}

export type GlobalComponent = {
  __typename?: 'GlobalComponent'
  _editable?: Maybe<Scalars['String']>
  _uid?: Maybe<Scalars['String']>
  component?: Maybe<Scalars['String']>
  drawer_background?: Maybe<Scalars['BlockScalar']>
  drawer_below_toolbar?: Maybe<Scalars['Boolean']>
  drawer_below_toolbar_xs?: Maybe<Scalars['Boolean']>
  drawer_body?: Maybe<Scalars['BlockScalar']>
  drawer_full_width_mobile?: Maybe<Scalars['Boolean']>
  drawer_variant?: Maybe<Scalars['String']>
  drawer_width?: Maybe<Scalars['String']>
  footer?: Maybe<Scalars['BlockScalar']>
  footer_config?: Maybe<Array<Maybe<Scalars['String']>>>
  mobile_nav_breakpoint?: Maybe<Scalars['String']>
  multi_toolbar?: Maybe<Scalars['BlockScalar']>
  seo_body?: Maybe<Scalars['BlockScalar']>
  seo_description?: Maybe<Scalars['String']>
  seo_robots?: Maybe<Scalars['Boolean']>
  seo_title?: Maybe<Scalars['String']>
  seo_website_url?: Maybe<Scalars['String']>
  setup_favicon?: Maybe<Scalars['String']>
  setup_google_analytics?: Maybe<Scalars['String']>
  setup_google_site_verification?: Maybe<Scalars['String']>
  setup_language?: Maybe<Scalars['String']>
  setup_supported_languages?: Maybe<Scalars['String']>
  tawkto?: Maybe<Scalars['String']>
  theme_base?: Maybe<Scalars['String']>
  theme_container_width?: Maybe<Scalars['String']>
  theme_error?: Maybe<Scalars['String']>
  theme_error_contrast?: Maybe<Scalars['String']>
  theme_font_alt1?: Maybe<Scalars['String']>
  theme_font_alt2?: Maybe<Scalars['String']>
  theme_font_alt3?: Maybe<Scalars['String']>
  theme_font_alt4?: Maybe<Scalars['String']>
  theme_font_default?: Maybe<Scalars['String']>
  theme_link?: Maybe<Scalars['String']>
  theme_link_hover?: Maybe<Scalars['String']>
  theme_primary?: Maybe<Scalars['String']>
  theme_primary_contrast?: Maybe<Scalars['String']>
  theme_secondary?: Maybe<Scalars['String']>
  theme_secondary_contrast?: Maybe<Scalars['String']>
  toolbar?: Maybe<Scalars['BlockScalar']>
  toolbar_color?: Maybe<Scalars['JsonScalar']>
  toolbar_config?: Maybe<Array<Maybe<Scalars['String']>>>
  toolbar_font_size?: Maybe<Scalars['String']>
  toolbar_main_height?: Maybe<Scalars['String']>
  toolbar_progress_color?: Maybe<Scalars['String']>
  toolbar_variant?: Maybe<Scalars['String']>
  website_logo?: Maybe<Scalars['String']>
  website_logo_invert?: Maybe<Scalars['String']>
  website_logo_invert_xs?: Maybe<Scalars['String']>
  website_logo_xs?: Maybe<Scalars['String']>
  website_slogan?: Maybe<Scalars['String']>
  website_title?: Maybe<Scalars['String']>
}

export type GlobalItems = {
  __typename?: 'GlobalItems'
  items?: Maybe<Array<Maybe<GlobalItem>>>
  total?: Maybe<Scalars['Int']>
}

export type GlobalFilterQuery = {
  drawer_variant?: Maybe<FilterQueryOperations>
  mobile_nav_breakpoint?: Maybe<FilterQueryOperations>
  drawer_width?: Maybe<FilterQueryOperations>
  drawer_below_toolbar?: Maybe<FilterQueryOperations>
  drawer_below_toolbar_xs?: Maybe<FilterQueryOperations>
  drawer_full_width_mobile?: Maybe<FilterQueryOperations>
  toolbar_variant?: Maybe<FilterQueryOperations>
  toolbar_config?: Maybe<FilterQueryOperations>
  toolbar_progress_color?: Maybe<FilterQueryOperations>
  toolbar_main_height?: Maybe<FilterQueryOperations>
  toolbar_font_size?: Maybe<FilterQueryOperations>
  website_title?: Maybe<FilterQueryOperations>
  website_slogan?: Maybe<FilterQueryOperations>
  setup_language?: Maybe<FilterQueryOperations>
  setup_supported_languages?: Maybe<FilterQueryOperations>
  setup_google_analytics?: Maybe<FilterQueryOperations>
  setup_google_site_verification?: Maybe<FilterQueryOperations>
  footer_config?: Maybe<FilterQueryOperations>
  seo_title?: Maybe<FilterQueryOperations>
  seo_website_url?: Maybe<FilterQueryOperations>
  seo_robots?: Maybe<FilterQueryOperations>
  theme_base?: Maybe<FilterQueryOperations>
  theme_primary?: Maybe<FilterQueryOperations>
  theme_primary_contrast?: Maybe<FilterQueryOperations>
  theme_secondary?: Maybe<FilterQueryOperations>
  theme_secondary_contrast?: Maybe<FilterQueryOperations>
  theme_error?: Maybe<FilterQueryOperations>
  theme_error_contrast?: Maybe<FilterQueryOperations>
  theme_link?: Maybe<FilterQueryOperations>
  theme_link_hover?: Maybe<FilterQueryOperations>
  theme_font_default?: Maybe<FilterQueryOperations>
  theme_font_alt1?: Maybe<FilterQueryOperations>
  theme_font_alt2?: Maybe<FilterQueryOperations>
  theme_font_alt3?: Maybe<FilterQueryOperations>
  theme_font_alt4?: Maybe<FilterQueryOperations>
  theme_container_width?: Maybe<FilterQueryOperations>
  tawkto?: Maybe<FilterQueryOperations>
}

export type StaticcontainerItem = {
  __typename?: 'StaticcontainerItem'
  alternates?: Maybe<Array<Maybe<Alternate>>>
  content?: Maybe<StaticcontainerComponent>
  created_at?: Maybe<Scalars['String']>
  first_published_at?: Maybe<Scalars['String']>
  full_slug?: Maybe<Scalars['String']>
  group_id?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
  is_startpage?: Maybe<Scalars['Boolean']>
  lang?: Maybe<Scalars['String']>
  meta_data?: Maybe<Scalars['JsonScalar']>
  name?: Maybe<Scalars['String']>
  parent_id?: Maybe<Scalars['Int']>
  path?: Maybe<Scalars['String']>
  position?: Maybe<Scalars['Int']>
  published_at?: Maybe<Scalars['String']>
  release_id?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  sort_by_date?: Maybe<Scalars['String']>
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>
  uuid?: Maybe<Scalars['String']>
}

export type StaticcontainerComponent = {
  __typename?: 'StaticcontainerComponent'
  _editable?: Maybe<Scalars['String']>
  _uid?: Maybe<Scalars['String']>
  body?: Maybe<Scalars['BlockScalar']>
  component?: Maybe<Scalars['String']>
}

export type StaticcontainerItems = {
  __typename?: 'StaticcontainerItems'
  items?: Maybe<Array<Maybe<StaticcontainerItem>>>
  total?: Maybe<Scalars['Int']>
}

export type ContentItem = {
  __typename?: 'ContentItem'
  alternates?: Maybe<Array<Maybe<Alternate>>>
  content?: Maybe<Scalars['JsonScalar']>
  content_string?: Maybe<Scalars['String']>
  created_at?: Maybe<Scalars['String']>
  first_published_at?: Maybe<Scalars['String']>
  full_slug?: Maybe<Scalars['String']>
  group_id?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
  is_startpage?: Maybe<Scalars['Boolean']>
  lang?: Maybe<Scalars['String']>
  meta_data?: Maybe<Scalars['JsonScalar']>
  name?: Maybe<Scalars['String']>
  parent_id?: Maybe<Scalars['Int']>
  path?: Maybe<Scalars['String']>
  position?: Maybe<Scalars['Int']>
  published_at?: Maybe<Scalars['String']>
  release_id?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  sort_by_date?: Maybe<Scalars['String']>
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>
  uuid?: Maybe<Scalars['String']>
}

export type ContentItems = {
  __typename?: 'ContentItems'
  items?: Maybe<Array<Maybe<ContentItem>>>
  total?: Maybe<Scalars['Int']>
}

export type Space = {
  __typename?: 'Space'
  domain: Scalars['String']
  id: Scalars['Int']
  languageCodes: Array<Maybe<Scalars['String']>>
  name: Scalars['String']
  version: Scalars['Int']
}

export type Tags = {
  __typename?: 'Tags'
  items: Array<Tag>
}

export type Tag = {
  __typename?: 'Tag'
  name: Scalars['String']
  taggingsCount: Scalars['Int']
}

export type Datasources = {
  __typename?: 'Datasources'
  items: Array<Datasource>
}

export type Datasource = {
  __typename?: 'Datasource'
  id: Scalars['Int']
  name: Scalars['String']
  slug: Scalars['String']
}

export type DatasourceEntries = {
  __typename?: 'DatasourceEntries'
  items: Array<DatasourceEntry>
  total: Scalars['Int']
}

export type DatasourceEntry = {
  __typename?: 'DatasourceEntry'
  dimensionValue?: Maybe<Scalars['String']>
  id: Scalars['Int']
  name: Scalars['String']
  value: Scalars['String']
}

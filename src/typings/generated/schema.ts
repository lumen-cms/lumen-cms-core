export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BlockScalar: any;
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: any;
  JsonScalar: any;
};

export type Alternate = {
  __typename?: 'Alternate';
  fullSlug: Scalars['String'];
  id: Scalars['Int'];
  isFolder?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  parentId?: Maybe<Scalars['Int']>;
  published: Scalars['Boolean'];
  slug: Scalars['String'];
};

export type Asset = {
  __typename?: 'Asset';
  alt?: Maybe<Scalars['String']>;
  copyright?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  focus?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type CategoryComponent = {
  __typename?: 'CategoryComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tag_reference?: Maybe<Scalars['JsonScalar']>;
};

export type CategoryFilterQuery = {
  name?: Maybe<FilterQueryOperations>;
};

export type CategoryItem = {
  __typename?: 'CategoryItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<CategoryComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type CategoryItems = {
  __typename?: 'CategoryItems';
  items?: Maybe<Array<Maybe<CategoryItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type ContentItem = {
  __typename?: 'ContentItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<Scalars['JsonScalar']>;
  content_string?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type ContentItems = {
  __typename?: 'ContentItems';
  items?: Maybe<Array<Maybe<ContentItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type Datasource = {
  __typename?: 'Datasource';
  id: Scalars['Int'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type DatasourceEntries = {
  __typename?: 'DatasourceEntries';
  items: Array<DatasourceEntry>;
  total: Scalars['Int'];
};

export type DatasourceEntry = {
  __typename?: 'DatasourceEntry';
  dimensionValue?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  value: Scalars['String'];
};

export type Datasources = {
  __typename?: 'Datasources';
  items: Array<Datasource>;
};

export type DocumentComponent = {
  __typename?: 'DocumentComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  categories?: Maybe<Array<Maybe<Story>>>;
  component?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  file?: Maybe<Asset>;
  title?: Maybe<Scalars['String']>;
};


export type DocumentComponentCategoriesArgs = {
  fields?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
};

export type DocumentFilterQuery = {
  categories?: Maybe<FilterQueryOperations>;
  title?: Maybe<FilterQueryOperations>;
};

export type DocumentItem = {
  __typename?: 'DocumentItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<DocumentComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type DocumentItems = {
  __typename?: 'DocumentItems';
  items?: Maybe<Array<Maybe<DocumentItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type DocumentcategoryComponent = {
  __typename?: 'DocumentcategoryComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type DocumentcategoryFilterQuery = {
  name?: Maybe<FilterQueryOperations>;
};

export type DocumentcategoryItem = {
  __typename?: 'DocumentcategoryItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<DocumentcategoryComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type DocumentcategoryItems = {
  __typename?: 'DocumentcategoryItems';
  items?: Maybe<Array<Maybe<DocumentcategoryItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type ErrorpageComponent = {
  __typename?: 'ErrorpageComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['BlockScalar']>;
  component?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type ErrorpageFilterQuery = {
  title?: Maybe<FilterQueryOperations>;
};

export type ErrorpageItem = {
  __typename?: 'ErrorpageItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<ErrorpageComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type ErrorpageItems = {
  __typename?: 'ErrorpageItems';
  items?: Maybe<Array<Maybe<ErrorpageItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type EventComponent = {
  __typename?: 'EventComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  all_day?: Maybe<Scalars['Boolean']>;
  background_color?: Maybe<Scalars['JsonScalar']>;
  body?: Maybe<Scalars['BlockScalar']>;
  category?: Maybe<Story>;
  color?: Maybe<Scalars['JsonScalar']>;
  component?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JsonScalar']>;
  date_format?: Maybe<Scalars['BlockScalar']>;
  description?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['String']>;
  image?: Maybe<Asset>;
  multiple_event_dates?: Maybe<Scalars['BlockScalar']>;
  start?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};


export type EventComponentCategoryArgs = {
  fields?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};

export type EventFilterQuery = {
  all_day?: Maybe<FilterQueryOperations>;
  category?: Maybe<FilterQueryOperations>;
  title?: Maybe<FilterQueryOperations>;
};

export type EventItem = {
  __typename?: 'EventItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<EventComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type EventItems = {
  __typename?: 'EventItems';
  items?: Maybe<Array<Maybe<EventItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type EventcategoryComponent = {
  __typename?: 'EventcategoryComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  background_color?: Maybe<Scalars['JsonScalar']>;
  color?: Maybe<Scalars['JsonScalar']>;
  component?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type EventcategoryFilterQuery = {
  title?: Maybe<FilterQueryOperations>;
};

export type EventcategoryItem = {
  __typename?: 'EventcategoryItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<EventcategoryComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type EventcategoryItems = {
  __typename?: 'EventcategoryItems';
  items?: Maybe<Array<Maybe<EventcategoryItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type FilterQueryOperations = {
  /** Must match all values of given array */
  all_in_array?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Greater than date (Exmples: 2019-03-03 or 2020-03-03T03:03:03) */
  gt_date?: Maybe<Scalars['ISO8601DateTime']>;
  /** Greater than float value */
  gt_float?: Maybe<Scalars['Float']>;
  /** Greater than integer value */
  gt_int?: Maybe<Scalars['Int']>;
  /** Matches exactly one value */
  in?: Maybe<Scalars['String']>;
  /** Matches any value of given array */
  in_array?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Matches exactly one integer value */
  in_int?: Maybe<Scalars['Int']>;
  /** Matches exactly one value with a wildcard search using * */
  like?: Maybe<Scalars['String']>;
  /** Less than date (Format: 2019-03-03 or 2020-03-03T03:03:03) */
  lt_date?: Maybe<Scalars['ISO8601DateTime']>;
  /** Less than float value */
  lt_float?: Maybe<Scalars['Float']>;
  /** Less than integer value */
  lt_int?: Maybe<Scalars['Int']>;
  /** Matches all without the given value */
  not_in?: Maybe<Scalars['String']>;
  /** Matches all without the given value */
  not_like?: Maybe<Scalars['String']>;
};

export type FormbuilderComponent = {
  __typename?: 'FormbuilderComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  additional_fields?: Maybe<Scalars['BlockScalar']>;
  component?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  fields?: Maybe<Scalars['BlockScalar']>;
  form_inline?: Maybe<Scalars['Boolean']>;
  full_width?: Maybe<Scalars['Boolean']>;
  margin?: Maybe<Scalars['String']>;
  spacing?: Maybe<Scalars['String']>;
  submit?: Maybe<Scalars['BlockScalar']>;
  success_message?: Maybe<Scalars['BlockScalar']>;
  variant?: Maybe<Scalars['String']>;
};

export type FormbuilderFilterQuery = {
  form_inline?: Maybe<FilterQueryOperations>;
  full_width?: Maybe<FilterQueryOperations>;
  margin?: Maybe<FilterQueryOperations>;
  spacing?: Maybe<FilterQueryOperations>;
  variant?: Maybe<FilterQueryOperations>;
};

export type FormbuilderItem = {
  __typename?: 'FormbuilderItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<FormbuilderComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type FormbuilderItems = {
  __typename?: 'FormbuilderItems';
  items?: Maybe<Array<Maybe<FormbuilderItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type GlobalComponent = {
  __typename?: 'GlobalComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  body_background_color?: Maybe<Scalars['JsonScalar']>;
  chat_button?: Maybe<Scalars['BlockScalar']>;
  component?: Maybe<Scalars['String']>;
  custom_css?: Maybe<Scalars['String']>;
  drawer_background?: Maybe<Scalars['BlockScalar']>;
  drawer_below_toolbar?: Maybe<Scalars['Boolean']>;
  drawer_below_toolbar_xs?: Maybe<Scalars['Boolean']>;
  drawer_body?: Maybe<Scalars['BlockScalar']>;
  drawer_full_width_mobile?: Maybe<Scalars['Boolean']>;
  drawer_variant?: Maybe<Scalars['String']>;
  drawer_width?: Maybe<Scalars['String']>;
  ecommerce?: Maybe<Scalars['BlockScalar']>;
  footer?: Maybe<Scalars['BlockScalar']>;
  footer_config?: Maybe<Array<Maybe<Scalars['String']>>>;
  mobile_nav_breakpoint?: Maybe<Scalars['String']>;
  multi_toolbar?: Maybe<Scalars['BlockScalar']>;
  promotion?: Maybe<Scalars['BlockScalar']>;
  pwa_app_description?: Maybe<Scalars['String']>;
  pwa_app_name?: Maybe<Scalars['String']>;
  scripts?: Maybe<Scalars['BlockScalar']>;
  seo_body?: Maybe<Scalars['BlockScalar']>;
  seo_description?: Maybe<Scalars['String']>;
  seo_robots?: Maybe<Scalars['Boolean']>;
  seo_title?: Maybe<Scalars['String']>;
  seo_website_url?: Maybe<Scalars['String']>;
  setup_ad_roll_adv_id?: Maybe<Scalars['String']>;
  setup_ad_roll_pix_id?: Maybe<Scalars['String']>;
  setup_facebook_pixel?: Maybe<Scalars['String']>;
  setup_favicon?: Maybe<Scalars['String']>;
  setup_google_analytics?: Maybe<Scalars['String']>;
  setup_google_site_verification?: Maybe<Scalars['String']>;
  setup_language?: Maybe<Scalars['String']>;
  setup_supported_languages?: Maybe<Scalars['String']>;
  snackbars?: Maybe<Scalars['BlockScalar']>;
  tawkto?: Maybe<Scalars['String']>;
  theme_base?: Maybe<Scalars['String']>;
  theme_container_width?: Maybe<Scalars['String']>;
  theme_error?: Maybe<Scalars['String']>;
  theme_error_contrast?: Maybe<Scalars['String']>;
  theme_font_alt1?: Maybe<Scalars['String']>;
  theme_font_alt2?: Maybe<Scalars['String']>;
  theme_font_alt3?: Maybe<Scalars['String']>;
  theme_font_alt4?: Maybe<Scalars['String']>;
  theme_font_default?: Maybe<Scalars['String']>;
  theme_link?: Maybe<Scalars['String']>;
  theme_link_hover?: Maybe<Scalars['String']>;
  theme_primary?: Maybe<Scalars['String']>;
  theme_primary_contrast?: Maybe<Scalars['String']>;
  theme_secondary?: Maybe<Scalars['String']>;
  theme_secondary_contrast?: Maybe<Scalars['String']>;
  toolbar?: Maybe<Scalars['BlockScalar']>;
  toolbar_background?: Maybe<Scalars['String']>;
  toolbar_color?: Maybe<Scalars['JsonScalar']>;
  toolbar_config?: Maybe<Array<Maybe<Scalars['String']>>>;
  toolbar_elevation?: Maybe<Scalars['String']>;
  toolbar_font_size?: Maybe<Scalars['String']>;
  toolbar_main_height?: Maybe<Scalars['String']>;
  toolbar_progress_color?: Maybe<Scalars['String']>;
  toolbar_variant?: Maybe<Scalars['String']>;
  website_logo?: Maybe<Scalars['String']>;
  website_logo_invert?: Maybe<Scalars['String']>;
  website_logo_invert_xs?: Maybe<Scalars['String']>;
  website_logo_xs?: Maybe<Scalars['String']>;
  website_slogan?: Maybe<Scalars['String']>;
  website_title?: Maybe<Scalars['String']>;
};

export type GlobalFilterQuery = {
  drawer_below_toolbar?: Maybe<FilterQueryOperations>;
  drawer_below_toolbar_xs?: Maybe<FilterQueryOperations>;
  drawer_full_width_mobile?: Maybe<FilterQueryOperations>;
  drawer_variant?: Maybe<FilterQueryOperations>;
  drawer_width?: Maybe<FilterQueryOperations>;
  footer_config?: Maybe<FilterQueryOperations>;
  mobile_nav_breakpoint?: Maybe<FilterQueryOperations>;
  pwa_app_name?: Maybe<FilterQueryOperations>;
  seo_robots?: Maybe<FilterQueryOperations>;
  seo_title?: Maybe<FilterQueryOperations>;
  seo_website_url?: Maybe<FilterQueryOperations>;
  setup_ad_roll_adv_id?: Maybe<FilterQueryOperations>;
  setup_ad_roll_pix_id?: Maybe<FilterQueryOperations>;
  setup_facebook_pixel?: Maybe<FilterQueryOperations>;
  setup_google_analytics?: Maybe<FilterQueryOperations>;
  setup_google_site_verification?: Maybe<FilterQueryOperations>;
  setup_language?: Maybe<FilterQueryOperations>;
  setup_supported_languages?: Maybe<FilterQueryOperations>;
  tawkto?: Maybe<FilterQueryOperations>;
  theme_base?: Maybe<FilterQueryOperations>;
  theme_container_width?: Maybe<FilterQueryOperations>;
  theme_error?: Maybe<FilterQueryOperations>;
  theme_error_contrast?: Maybe<FilterQueryOperations>;
  theme_font_alt1?: Maybe<FilterQueryOperations>;
  theme_font_alt2?: Maybe<FilterQueryOperations>;
  theme_font_alt3?: Maybe<FilterQueryOperations>;
  theme_font_alt4?: Maybe<FilterQueryOperations>;
  theme_font_default?: Maybe<FilterQueryOperations>;
  theme_link?: Maybe<FilterQueryOperations>;
  theme_link_hover?: Maybe<FilterQueryOperations>;
  theme_primary?: Maybe<FilterQueryOperations>;
  theme_primary_contrast?: Maybe<FilterQueryOperations>;
  theme_secondary?: Maybe<FilterQueryOperations>;
  theme_secondary_contrast?: Maybe<FilterQueryOperations>;
  toolbar_background?: Maybe<FilterQueryOperations>;
  toolbar_config?: Maybe<FilterQueryOperations>;
  toolbar_elevation?: Maybe<FilterQueryOperations>;
  toolbar_font_size?: Maybe<FilterQueryOperations>;
  toolbar_main_height?: Maybe<FilterQueryOperations>;
  toolbar_progress_color?: Maybe<FilterQueryOperations>;
  toolbar_variant?: Maybe<FilterQueryOperations>;
  website_slogan?: Maybe<FilterQueryOperations>;
  website_title?: Maybe<FilterQueryOperations>;
};

export type GlobalItem = {
  __typename?: 'GlobalItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<GlobalComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type GlobalItems = {
  __typename?: 'GlobalItems';
  items?: Maybe<Array<Maybe<GlobalItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type LinkEntries = {
  __typename?: 'LinkEntries';
  items: Array<LinkEntry>;
};

export type LinkEntry = {
  __typename?: 'LinkEntry';
  id?: Maybe<Scalars['Int']>;
  isFolder?: Maybe<Scalars['Boolean']>;
  isStartpage?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  published?: Maybe<Scalars['Boolean']>;
  slug?: Maybe<Scalars['String']>;
  uuid?: Maybe<Scalars['String']>;
};

export type NewsComponent = {
  __typename?: 'NewsComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  category?: Maybe<Story>;
  component?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['JsonScalar']>;
  date_format?: Maybe<Scalars['BlockScalar']>;
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Asset>;
  published?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};


export type NewsComponentCategoryArgs = {
  fields?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};

export type NewsFilterQuery = {
  category?: Maybe<FilterQueryOperations>;
  title?: Maybe<FilterQueryOperations>;
};

export type NewsItem = {
  __typename?: 'NewsItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<NewsComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type NewsItems = {
  __typename?: 'NewsItems';
  items?: Maybe<Array<Maybe<NewsItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type NewscategoryComponent = {
  __typename?: 'NewscategoryComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  component?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type NewscategoryFilterQuery = {
  name?: Maybe<FilterQueryOperations>;
};

export type NewscategoryItem = {
  __typename?: 'NewscategoryItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<NewscategoryComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type NewscategoryItems = {
  __typename?: 'NewscategoryItems';
  items?: Maybe<Array<Maybe<NewscategoryItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type PageComponent = {
  __typename?: 'PageComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['BlockScalar']>;
  categories?: Maybe<Array<Maybe<Story>>>;
  component?: Maybe<Scalars['String']>;
  meta_description?: Maybe<Scalars['String']>;
  meta_robots?: Maybe<Scalars['Boolean']>;
  meta_title?: Maybe<Scalars['String']>;
  mobile_breakpoint?: Maybe<Scalars['String']>;
  preview_image?: Maybe<Scalars['String']>;
  preview_publish_date?: Maybe<Scalars['String']>;
  preview_subtitle?: Maybe<Scalars['String']>;
  preview_teaser?: Maybe<Scalars['String']>;
  preview_title?: Maybe<Scalars['String']>;
  property?: Maybe<Array<Maybe<Scalars['String']>>>;
  right_body?: Maybe<Scalars['BlockScalar']>;
  right_drawer_width?: Maybe<Scalars['String']>;
  seo_body?: Maybe<Scalars['BlockScalar']>;
};


export type PageComponentCategoriesArgs = {
  fields?: Maybe<Array<Maybe<Scalars['String']>>>;
  language?: Maybe<Scalars['String']>;
};

export type PageFilterQuery = {
  categories?: Maybe<FilterQueryOperations>;
  meta_robots?: Maybe<FilterQueryOperations>;
  meta_title?: Maybe<FilterQueryOperations>;
  mobile_breakpoint?: Maybe<FilterQueryOperations>;
  preview_subtitle?: Maybe<FilterQueryOperations>;
  preview_title?: Maybe<FilterQueryOperations>;
  property?: Maybe<FilterQueryOperations>;
  right_drawer_width?: Maybe<FilterQueryOperations>;
};

export type PageItem = {
  __typename?: 'PageItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<PageComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type PageItems = {
  __typename?: 'PageItems';
  items?: Maybe<Array<Maybe<PageItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type QueryType = {
  __typename?: 'QueryType';
  CategoryItem?: Maybe<CategoryItem>;
  CategoryItems?: Maybe<CategoryItems>;
  ContentNode?: Maybe<ContentItem>;
  ContentNodes?: Maybe<ContentItems>;
  DatasourceEntries?: Maybe<DatasourceEntries>;
  Datasources?: Maybe<Datasources>;
  DocumentItem?: Maybe<DocumentItem>;
  DocumentItems?: Maybe<DocumentItems>;
  DocumentcategoryItem?: Maybe<DocumentcategoryItem>;
  DocumentcategoryItems?: Maybe<DocumentcategoryItems>;
  ErrorpageItem?: Maybe<ErrorpageItem>;
  ErrorpageItems?: Maybe<ErrorpageItems>;
  EventItem?: Maybe<EventItem>;
  EventItems?: Maybe<EventItems>;
  EventcategoryItem?: Maybe<EventcategoryItem>;
  EventcategoryItems?: Maybe<EventcategoryItems>;
  FormbuilderItem?: Maybe<FormbuilderItem>;
  FormbuilderItems?: Maybe<FormbuilderItems>;
  GlobalItem?: Maybe<GlobalItem>;
  GlobalItems?: Maybe<GlobalItems>;
  Links?: Maybe<LinkEntries>;
  NewsItem?: Maybe<NewsItem>;
  NewsItems?: Maybe<NewsItems>;
  NewscategoryItem?: Maybe<NewscategoryItem>;
  NewscategoryItems?: Maybe<NewscategoryItems>;
  PageItem?: Maybe<PageItem>;
  PageItems?: Maybe<PageItems>;
  RateLimit?: Maybe<RateLimit>;
  Space?: Maybe<Space>;
  StaticcontainerItem?: Maybe<StaticcontainerItem>;
  StaticcontainerItems?: Maybe<StaticcontainerItems>;
  Tags?: Maybe<Tags>;
};


export type QueryTypeCategoryItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeCategoryItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<CategoryFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeContentNodeArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeContentNodesArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeDatasourceEntriesArgs = {
  datasource?: Maybe<Scalars['String']>;
  dimension?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
};


export type QueryTypeDatasourcesArgs = {
  by_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  search?: Maybe<Scalars['String']>;
};


export type QueryTypeDocumentItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeDocumentItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<DocumentFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeDocumentcategoryItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeDocumentcategoryItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<DocumentcategoryFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeErrorpageItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeErrorpageItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<ErrorpageFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeEventItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeEventItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<EventFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeEventcategoryItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeEventcategoryItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<EventcategoryFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeFormbuilderItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeFormbuilderItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<FormbuilderFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeGlobalItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeGlobalItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<GlobalFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeLinksArgs = {
  paginated?: Maybe<Scalars['Boolean']>;
  starts_with?: Maybe<Scalars['String']>;
};


export type QueryTypeNewsItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeNewsItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<NewsFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeNewscategoryItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeNewscategoryItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<NewscategoryFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypePageItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypePageItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  filter_query_v2?: Maybe<PageFilterQuery>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeStaticcontainerItemArgs = {
  find_by?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  language?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
};


export type QueryTypeStaticcontainerItemsArgs = {
  by_slugs?: Maybe<Scalars['String']>;
  by_uuids?: Maybe<Scalars['String']>;
  by_uuids_ordered?: Maybe<Scalars['String']>;
  excluding_fields?: Maybe<Scalars['String']>;
  excluding_ids?: Maybe<Scalars['String']>;
  excluding_slugs?: Maybe<Scalars['String']>;
  fallback_lang?: Maybe<Scalars['String']>;
  filter_query?: Maybe<Scalars['JsonScalar']>;
  first_published_at_gt?: Maybe<Scalars['String']>;
  first_published_at_lt?: Maybe<Scalars['String']>;
  from_release?: Maybe<Scalars['String']>;
  is_startpage?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  per_page?: Maybe<Scalars['Int']>;
  published_at_gt?: Maybe<Scalars['String']>;
  published_at_lt?: Maybe<Scalars['String']>;
  resolve_links?: Maybe<Scalars['String']>;
  resolve_relations?: Maybe<Scalars['String']>;
  search_term?: Maybe<Scalars['String']>;
  sort_by?: Maybe<Scalars['String']>;
  starts_with?: Maybe<Scalars['String']>;
  with_tag?: Maybe<Scalars['String']>;
};


export type QueryTypeTagsArgs = {
  starts_with?: Maybe<Scalars['String']>;
};

export type RateLimit = {
  __typename?: 'RateLimit';
  maxCost: Scalars['Int'];
};

export type Space = {
  __typename?: 'Space';
  domain: Scalars['String'];
  id: Scalars['Int'];
  languageCodes: Array<Maybe<Scalars['String']>>;
  name: Scalars['String'];
  version: Scalars['Int'];
};

export type StaticcontainerComponent = {
  __typename?: 'StaticcontainerComponent';
  _editable?: Maybe<Scalars['String']>;
  _uid?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['BlockScalar']>;
  component?: Maybe<Scalars['String']>;
};

export type StaticcontainerItem = {
  __typename?: 'StaticcontainerItem';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<StaticcontainerComponent>;
  created_at?: Maybe<Scalars['String']>;
  default_full_slug?: Maybe<Scalars['String']>;
  first_published_at?: Maybe<Scalars['String']>;
  full_slug?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  is_startpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  meta_data?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parent_id?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  published_at?: Maybe<Scalars['String']>;
  release_id?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sort_by_date?: Maybe<Scalars['String']>;
  tag_list?: Maybe<Array<Maybe<Scalars['String']>>>;
  translated_slugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type StaticcontainerItems = {
  __typename?: 'StaticcontainerItems';
  items?: Maybe<Array<Maybe<StaticcontainerItem>>>;
  total?: Maybe<Scalars['Int']>;
};

export type Story = {
  __typename?: 'Story';
  alternates?: Maybe<Array<Maybe<Alternate>>>;
  content?: Maybe<Scalars['JsonScalar']>;
  createdAt?: Maybe<Scalars['String']>;
  firstPublishedAt?: Maybe<Scalars['String']>;
  fullSlug?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  isStartpage?: Maybe<Scalars['Boolean']>;
  lang?: Maybe<Scalars['String']>;
  metaData?: Maybe<Scalars['JsonScalar']>;
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['Int']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  publishedAt?: Maybe<Scalars['String']>;
  releaseId?: Maybe<Scalars['Int']>;
  slug?: Maybe<Scalars['String']>;
  sortByDate?: Maybe<Scalars['String']>;
  tagList?: Maybe<Array<Maybe<Scalars['String']>>>;
  translatedSlugs?: Maybe<Array<Maybe<TranslatedSlug>>>;
  uuid?: Maybe<Scalars['String']>;
};

export type Tag = {
  __typename?: 'Tag';
  name: Scalars['String'];
  taggingsCount: Scalars['Int'];
};

export type Tags = {
  __typename?: 'Tags';
  items: Array<Tag>;
};

export type TranslatedSlug = {
  __typename?: 'TranslatedSlug';
  lang: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
};

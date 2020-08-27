import {
  CategoryBoxStoryblok,
  ListSearchAutocompleteStoryblok,
  ListSearchFieldStoryblok,
  ListWidgetStoryblok
} from '../../typings/generated/components-schema'

export type LmListWidgetProps = { content: ListWidgetStoryblok }
export type LmCategoryBoxProps = { content: CategoryBoxStoryblok }
export type LmListSearchAutocompleteProps = {
  content: ListSearchAutocompleteStoryblok
}
export type LmListSearchFieldProps = { content: ListSearchFieldStoryblok }

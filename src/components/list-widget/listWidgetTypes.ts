import {
  CategoryBoxStoryblok,
  ListSearchAutocompleteStoryblok,
  ListSearchFieldStoryblok,
  ListWidgetStoryblok
} from '../../typings/generated/components-schema'
import { StoryData } from 'storyblok-js-client'
import { PageComponent } from '../../typings/generated/schema'
import { AllCategoryData } from '../../typings/app'

export type LmListWidgetProps = {
  content: ListWidgetStoryblok & {
    list_widget_data: {
      items: StoryData<PageComponent>[]
      total: number
      perPage: number
      cv: number
    }
  }
}
export type LmCategoryBoxProps = {
  content: CategoryBoxStoryblok & {
    category_box_data: AllCategoryData
  }
}
export type LmListSearchAutocompleteProps = {
  content: ListSearchAutocompleteStoryblok
}
export type LmListSearchFieldProps = { content: ListSearchFieldStoryblok }

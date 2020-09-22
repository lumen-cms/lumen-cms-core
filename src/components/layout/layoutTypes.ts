import { AppPageProps } from '../../typings/app'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'

export type AppContainerProps = {
  content: AppPageProps
}
export type AppSeoProps = {
  settings: GlobalStoryblok
  page?: PageStoryblok | null
  previewImage?: string
}

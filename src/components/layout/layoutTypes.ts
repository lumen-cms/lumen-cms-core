import { AppPageProps } from '../../typings/app'
import { PageStoryblok } from '../../typings/generated/components-schema'

export type AppContainerProps = {
  content: AppPageProps
}
export type AppSeoProps = {
  page?: PageStoryblok | null
  previewImage?: string
}

export type ContentSpaceProps = {
  isBlock?: boolean
}

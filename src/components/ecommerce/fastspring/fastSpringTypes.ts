import {
  ButtonStoryblok,
  EcommerceFastspringProductStoryblok,
  HeadlineStoryblok,
  IconStoryblok,
  ImageStoryblok
} from '../../../typings/generated/components-schema'

export type FastSpringCheckoutProps = {
  content: EcommerceFastspringProductStoryblok
  trigger: ButtonStoryblok | ImageStoryblok | IconStoryblok | HeadlineStoryblok // need to keep up to date
}

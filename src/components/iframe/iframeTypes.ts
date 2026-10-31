import {
  IframeAdvancedStoryblok,
  IframeStoryblok
} from '../../typings/generated/components-schema'

export type LmIframeProps = {
  content: IframeStoryblok | IframeAdvancedStoryblok
}
export type LmIframeAdvancedProps = { content: IframeAdvancedStoryblok }

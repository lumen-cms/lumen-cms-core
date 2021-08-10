import {
  StaticContainerStoryblok,
  StaticSectionStoryblok
} from '../../typings/generated/components-schema'
import { StoryData } from 'storyblok-js-client'

export type LmStaticContainerProps = { content: StaticContainerStoryblok }
export type LmStaticSectionProps = {
  content: StaticSectionStoryblok & {
    container: StoryData<StaticContainerStoryblok>
  }
}

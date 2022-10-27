import {
  StaticContainerStoryblok,
  StaticSectionStoryblok
} from '../../typings/generated/components-schema'
import { ISbStoryData } from 'storyblok-js-client/types/interfaces'

export type LmStaticContainerProps = { content: StaticContainerStoryblok }
export type LmStaticSectionProps = {
  content: StaticSectionStoryblok & {
    container: ISbStoryData<StaticContainerStoryblok>
  }
}

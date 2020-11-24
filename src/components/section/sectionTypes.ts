import { GridDirection } from '@material-ui/core'
import {
  ColumnStoryblok,
  RowStoryblok,
  SectionParallaxStoryblok,
  SectionStoryblok,
  SectionVideoBgStoryblok
} from '../../typings/generated/components-schema'

export interface SectionProps extends SectionStoryblok {
  presetVariant?: SectionStoryblok['variant']
}

export type LmSectionParallaxProps = {
  content: SectionParallaxStoryblok
  sectionPosition?: number
}
export type LmSectionVideoProps = {
  content: SectionVideoBgStoryblok
  sectionPosition?: number
}
export type LmGridRowProps = { content: RowStoryblok }
export type LmGridColumnProps = {
  content: ColumnStoryblok
  parent: { direction: GridDirection }
}
export type LmSectionProps = {
  content: SectionProps
  sectionPosition?: number
}

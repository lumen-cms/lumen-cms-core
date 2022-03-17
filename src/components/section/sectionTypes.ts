import { GridDirection } from '@mui/material'
import {
  ColumnStoryblok,
  RowStoryblok,
  SectionParallaxStoryblok,
  SectionStoryblok,
  SectionVideoBgStoryblok
} from '../../typings/generated/components-schema'
import { LmImagePlaceholder } from '../image/imageTypes'

export interface SectionProps extends SectionStoryblok {
  presetVariant?: SectionStoryblok['variant']
}

export type LmSectionParallaxProps = {
  content: SectionParallaxStoryblok
  sectionPosition?: number
}
export type LmSectionVideoProps = {
  content: SectionVideoBgStoryblok & {
    section_video_bg_data: LmImagePlaceholder
  }
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

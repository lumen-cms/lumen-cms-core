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

export type LmSectionParallaxProps = { content: SectionParallaxStoryblok }
export type LmSectionVideoProps = { content: SectionVideoBgStoryblok }
export type LmGridRowProps = { content: RowStoryblok }
export type LmGridColumnProps = { content: ColumnStoryblok }

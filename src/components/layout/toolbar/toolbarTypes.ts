import {
  GlobalStoryblok,
  ToolbarLogoStoryblok,
  ToolbarNaviButtonStoryblok,
  ToolbarRowSectionStoryblok,
  ToolbarRowStoryblok
} from '../../../typings/generated/components-schema'

export type LmToolbarLogoProps = {
  content?: ToolbarLogoStoryblok
  settings: GlobalStoryblok
}
export type LmToggleDrawerButtonProps = { content: ToolbarNaviButtonStoryblok }
export type AppHeaderProps = {
  settings: GlobalStoryblok
}
export type LmToolbarSectionProps = {
  content: ToolbarRowSectionStoryblok
  settings: GlobalStoryblok
}
export type LmToolbarRowProps = {
  content: ToolbarRowStoryblok
  settings: GlobalStoryblok
}

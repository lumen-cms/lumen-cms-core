import {
  HeadlineStoryblok,
  NavItemStoryblok,
  NavListStoryblok
} from '../../typings/generated/components-schema'

export type LmNavListProps = {
  content: NavListStoryblok
}

export type LmNavItemProps = {
  content: NavItemStoryblok
  options: HeadlineStoryblok
}
export type LmNavListItemProps = NavItemStoryblok

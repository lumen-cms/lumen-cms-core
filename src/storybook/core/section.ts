import { StorybookOptionProps } from './storybook_typing'
import {
  BackgroundStoryblok,
  CardListItemStoryblok,
  CardListStoryblok,
  ColumnStoryblok,
  FlexRowStoryblok,
  ImageListItemStoryblok,
  ImageListStoryblok,
  ListWidgetStoryblok,
  ParallaxItemStoryblok,
  RowStoryblok,
  SectionParallaxStoryblok,
  SectionStoryblok,
  SectionVideoBgStoryblok,
  TabsItemStoryblok,
  TabsStoryblok,
  TimelineItemStoryblok,
  TimelineStoryblok
} from '../../typings/generated/components-schema'
import { getLabel, getSentences, randomIntFromInterval, storyImageUrls } from './various'
import getKnobComponents from '../helpers/getKnobComponent'

export const storySectionVideoBg = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<SectionVideoBgStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'section_video_bg',
    options,
    knob,
    count
  }) as SectionVideoBgStoryblok
}

export const storySection = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<SectionStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'section',
    options,
    knob,
    count
  }) as SectionStoryblok
}

export const storyRow = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<RowStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'row',
    options,
    knob,
    count
  }) as RowStoryblok
}

export const storyColumn = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<ColumnStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'column',
    options,
    knob,
    count
  }) as ColumnStoryblok
}

export const storyCardList = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<CardListStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'card_list',
    options,
    knob,
    count
  }) as CardListStoryblok
}

export const storyCardListItem = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<CardListItemStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'card_list_item',
    options: {
      image: storyImageUrls[randomIntFromInterval(0, storyImageUrls.length - 1)],
      title: getLabel(),
      subtitle: getLabel(),
      description: getSentences(),
      ...options
    },
    knob,
    count
  }) as CardListItemStoryblok
}

export const storyImageList = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<ImageListStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'image_list',
    options,
    knob,
    count
  }) as ImageListStoryblok
}

export const storyImageListItem = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<ImageListItemStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'image_list_item',
    options: {
      source: storyImageUrls[randomIntFromInterval(0, storyImageUrls.length - 1)],
      label: getLabel(3),
      ...options
    },
    knob,
    count
  }) as ImageListItemStoryblok
}

export const storyFlexRow = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<FlexRowStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'flex_row',
    options,
    knob,
    count
  }) as FlexRowStoryblok
}

export const storyListWidget = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<ListWidgetStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'list_widget',
    options,
    knob,
    count
  }) as ListWidgetStoryblok
}

export const storyBackground = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<BackgroundStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'background',
    options,
    knob,
    count
  }) as BackgroundStoryblok
}

export const storyTabs = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<TabsStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'tabs',
    options,
    knob,
    count
  }) as TabsStoryblok
}

export const storyTabsItem = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<TabsItemStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'tabs_item',
    options: {
      title: getLabel(),
      ...options
    },
    knob,
    count
  }) as TabsItemStoryblok
}

export const storySectionParallax = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<SectionParallaxStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'section_parallax',
    options,
    knob,
    count
  }) as SectionParallaxStoryblok
}

export const storyParallaxItem = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<ParallaxItemStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'parallax_item',
    options,
    knob,
    count
  }) as ParallaxItemStoryblok
}

export const storyTimeline = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<TimelineStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'timeline',
    options,
    knob,
    count
  }) as TimelineStoryblok
}

export const storyTimelineItem = ({ options = {}, knob, count = '' }: StorybookOptionProps & { options?: Partial<TimelineItemStoryblok> } = {}) => {
  return getKnobComponents({
    componentName: 'timeline_item',
    options: {
      title: getLabel(),
      subheader: getLabel(),
      ...options
    } as TimelineItemStoryblok,
    knob,
    count
  }) as TimelineItemStoryblok
}

import {
  ListSearchAutocompleteStoryblok,
  ToolbarLogoStoryblok,
  ToolbarRowSectionStoryblok,
  ToolbarRowStoryblok
} from '../../typings/generated/components-schema'
import { StorybookOptionProps } from '../core/storybook_typing'
import getKnobComponents from '../helpers/getKnobComponent'
import { getUid } from '../core/sharedFunctions'

export const storyToolbarRow = ({
  options = {},
  knob,
  count = ''
}: StorybookOptionProps & {
  options?: Partial<ToolbarRowStoryblok>
} = {}): ToolbarRowStoryblok => {
  return getKnobComponents({
    componentName: 'toolbar_row',
    options,
    knob,
    count
  }) as ToolbarRowStoryblok
}

export const storyToolbarSection = ({
  options = {},
  knob,
  count = ''
}: StorybookOptionProps & {
  options?: Partial<ToolbarRowSectionStoryblok>
}): ToolbarRowSectionStoryblok => {
  return getKnobComponents({
    componentName: 'toolbar_row_section',
    options,
    knob,
    count
  }) as ToolbarRowSectionStoryblok
}

export const storyListSearchAutocomplete = ({
  options = {},
  knob,
  count
}: {
  options?: Partial<ListSearchAutocompleteStoryblok>
  knob?: string
  count?: number
} = {}): ListSearchAutocompleteStoryblok => {
  return getKnobComponents({
    componentName: 'list_search_autocomplete',
    options,
    knob,
    count
  }) as ListSearchAutocompleteStoryblok
}

export const storyToolbarLogo = ({}): ToolbarLogoStoryblok => ({
  _uid: getUid(),
  component: 'toolbar_logo'
})

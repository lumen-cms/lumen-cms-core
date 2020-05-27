import * as React from 'react'
import { LmComponentRender as LmListSearchAutocomplete } from '../src/'
import { ListSearchAutocompleteStoryblok } from '../src/typings/generated/components-schema'
import { storyListSearchAutocomplete } from '../src/storybook/layout/toolbar'

const props: ListSearchAutocompleteStoryblok = {
  _uid: '123',
  component: 'list_search_autocomplete',
  label: 'Some Test',
  placeholder: 'Some Placeholder',
  not_found_label: 'There is no item found...'
}

export default {
  title: 'Autocomplete Search'
}

export const Basic = () => (
  <div className="p-3">
    <h3>Default:</h3>
    <LmListSearchAutocomplete content={{ ...props, label: 'Search' }} />
    <h3>Default without label:</h3>
    <LmListSearchAutocomplete content={{ ...props, label: undefined }} />
    <h3>Fullwidth:</h3>
    <LmListSearchAutocomplete content={{ ...props, label: undefined, fullwidth: true }} />
    <h3>Square:</h3>
    <LmListSearchAutocomplete content={{ ...props, label: undefined, shape: 'square' }} />
    <h3>Square fullwidth:</h3>
    <LmListSearchAutocomplete
      content={{ ...props, label: undefined, fullwidth: true, shape: 'square' }} />
    <h3>Rounded:</h3>
    <LmListSearchAutocomplete
      content={{ ...props, label: undefined, shape: 'rounded' }} />
    <h3>Rounded fullwidth:</h3>
    <LmListSearchAutocomplete
      content={{ ...props, label: undefined, fullwidth: true, shape: 'rounded' }} />
  </div>
)
export const Mobile = () => (
  <div>
    <h3>Mobile sm:</h3>
    <LmListSearchAutocomplete content={{ ...props, label: undefined, mobile_breakpoint: 'sm' }} />
    <h3>Mobile lg:</h3>
    <LmListSearchAutocomplete content={{ ...props, label: undefined, mobile_breakpoint: 'lg' }} />
  </div>
)
export const Shaped = () => (
  <div className="p-3">
    <h3>Default:</h3>
    <LmListSearchAutocomplete content={{ ...props, label: 'Search', outlined: true }} />
    <h3>Default without label:</h3>
    <LmListSearchAutocomplete
      content={{ ...props, label: undefined, menu_border_radius: '0px', shape: 'square' }} />
    <h3>Fullwidth:</h3>
    <LmListSearchAutocomplete
      content={{ ...props, label: undefined, fullwidth: true, outlined: true, menu_border_radius: '16px' }} />
    <h3>Square:</h3>
    <LmListSearchAutocomplete
      content={{
        ...props,
        label: undefined,
        outlined: true,
        shape: 'square',
        menu_border_radius: '0px 4px 16px 16px'
      }} />
    <h3>Align Menu to the right</h3>
    <div className="text-center">
      <LmListSearchAutocomplete
        content={{
          ...props,
          label: undefined,
          outlined: true,
          shape: 'square',
          menu_border_radius: '0px',
          menu_align_right: true
        }} />
    </div>
  </div>
)
export const Playground = () => (
  <div className="text-center p-5">
    <LmListSearchAutocomplete
      content={storyListSearchAutocomplete({
        options: {
          placeholder: 'Search..'
        }
      })} />
  </div>
)


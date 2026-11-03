import type { ISbStoryParams } from 'storyblok-js-client'
import type { PagePropsOptions } from '../../typings/app'

// Fetch-only metadata follows this page's hooks without entering serialized
// client props or a process-global preview/release setting.
const requests = new WeakMap<PagePropsOptions, ISbStoryParams>()
export const setStoryblokRequest = (
  props: PagePropsOptions,
  params: ISbStoryParams
) => requests.set(props, params)
export const getStoryblokRequest = (props: PagePropsOptions): ISbStoryParams =>
  requests.get(props) || {}

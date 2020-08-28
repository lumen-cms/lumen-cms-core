import { LmSnackbar } from '../src/components/snackbar/Snackbar'
import { storyHeadline, storySnackbar } from '../src/storybook/core/various'
import * as React from 'react'
import { ButtonStoryblok } from '../src/typings/generated/components-schema'

export default {
  title: 'Snackbar'
}

export const HideOnScroll = () => (
  <div style={{ height: '150vh' }}>
    <h3>Start scroll to hide the snackbar.</h3>
    <LmSnackbar content={{
      ...storySnackbar(),
      display: 'hide_on_scroll',
      descriptions: [storyHeadline({
        options: {
          typography: 'body1'
        }
      })],
      close_action: [{
        component: 'button',
        _uid: '3qewqeq',
        icon: {
          name: 'close'
        }
      } as ButtonStoryblok]
    }} />
  </div>
)

export const ShowOnScroll = () => (
  <div style={{ height: '150vh' }}>
    <h3>Start scroll to show the snackbar.</h3>
    <LmSnackbar content={{
      ...storySnackbar(),
      display: 'show_on_scroll',
      descriptions: [storyHeadline({
        options: {
          typography: 'body1'
        }
      })],
      close_action: [{
        component: 'button',
        _uid: '3qewqeq',
        icon: {
          name: 'close'
        }
      } as ButtonStoryblok]
    }} />
  </div>
)

export const Autohide = () => (
  <>
    <h3>The snackbar autohides after 4 seconds</h3>
    <LmSnackbar content={{
      ...storySnackbar(),
      auto_close: 4000,
      descriptions: [storyHeadline({
        options: {
          typography: 'body1'
        }
      })],
      close_action: [{
        component: 'button',
        _uid: '3qewqeq',
        icon: {
          name: 'close'
        }
      } as ButtonStoryblok]
    }} />
  </>
)

export const Autoshow = () => (
  <>
    <h3>The snackbar shows after 4 seconds</h3>
    <LmSnackbar content={{
      ...storySnackbar(),
      auto_show: 4000,
      descriptions: [storyHeadline({
        options: {
          typography: 'body1'
        }
      })],
      close_action: [{
        component: 'button',
        _uid: '3qewqeq',
        icon: {
          name: 'close'
        }
      } as ButtonStoryblok]
    }} />
  </>
)

export const Playground = () => (
  <LmSnackbar content={{
    ...storySnackbar(),
    descriptions: [storyHeadline({
      options: {
        typography: 'body1'
      }
    })],
    close_action: [{
      component: 'button',
      _uid: '3qewqeq',
      icon: {
        name: 'close'
      }
    } as ButtonStoryblok]
  }} />
)

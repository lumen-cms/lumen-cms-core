import { LmSnackbar } from '../src/components/snackbar/Snackbar'
import { storyHeadline, storySnackbar } from '../src/storybook/core/various'
import * as React from 'react'
import { ButtonStoryblok } from '../src/typings/generated/components-schema'

export default {
  title: 'Snackbar'
}

export const Playground = () => (
  <LmSnackbar content={{
    ...storySnackbar(),
    background_color: {
      rgba: '#ccc'
    },
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

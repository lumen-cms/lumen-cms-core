import { addDecorator, addParameters } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import StoriesLayout from '../src/storybook/components/StoriesLayout'
import './mockNextRouter'

addParameters({
  options: {
    storySort: (a: any, b: any) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
  }
})

addDecorator(withKnobs)
addDecorator(StoriesLayout)

import StoriesLayout from '../src/storybook/components/StoriesLayout'
import '../src/storybook/mockNextRouter'

export const parameters = {
  options: {
    storySort: (a: any, b: any) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
  }
}

export const decorators = [StoriesLayout]



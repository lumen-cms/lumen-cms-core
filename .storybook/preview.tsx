import * as NextImage from 'next/image'
import StoriesLayout from '../src/storybook/components/StoriesLayout'
import '../src/storybook/mockNextRouter'
import isChromatic from 'chromatic/isChromatic'

// overwrite and make sure ENV always same
process.env.NEXT_PUBLIC_PUBLIC_TOKEN = 'm85LRUo0sX4yo9Q96VMQlQtt'
process.env.NEXT_PUBLIC_PREVIEW_TOKEN = 'qASJXPT2cwH76pA9vpJbxAtt'
process.env.NEXT_PUBLIC_ROOT_DIRECTORY = 'en'

const OriginalNextImage = NextImage.default
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: any) => (
    <OriginalNextImage
      {...props}
      loading={isChromatic() ? 'eager' : props.loading}
    />
  )
})

export const parameters = {
  options: {
    storySort: (a: any, b: any) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
  }
}

export const decorators = [StoriesLayout]

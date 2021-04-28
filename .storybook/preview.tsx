import * as NextImage from 'next/image'
import StoriesLayout from '../src/storybook/components/StoriesLayout'
import '../src/storybook/mockNextRouter'
import isChromatic from 'chromatic/isChromatic'
import { CONFIG } from '@CONFIG'

// overwrite and make sure ENV always same (studentsgoabroad)
CONFIG.publicToken = 'm85LRUo0sX4yo9Q96VMQlQtt'
CONFIG.previewToken = 'qASJXPT2cwH76pA9vpJbxAtt'
CONFIG.rootDirectory = 'en'

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

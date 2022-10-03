import * as NextImage from 'next/image'
import * as NextFutureImage from 'next/future/image'
import StoriesLayout from '../src/storybook/components/StoriesLayout'
import '../src/storybook/mockNextRouter'
import isChromatic from 'chromatic/isChromatic'
import { CONFIG } from '@CONFIG'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { storybookImgLoader } from '../src/utils/storybookImgLoader'

// overwrite and make sure ENV always same (studentsgoabroad)
CONFIG.publicToken = 'm85LRUo0sX4yo9Q96VMQlQtt'
CONFIG.previewToken = 'qASJXPT2cwH76pA9vpJbxAtt'
CONFIG.rootDirectory = 'en'

const OriginalNextFutureImage = NextFutureImage.default
Object.defineProperty(NextFutureImage, 'default', {
  configurable: true,
  value: (props: any) => (
    <OriginalNextFutureImage
      {...props}
      {...storybookImgLoader(props.src)}
      loading={isChromatic() ? 'eager' : props.loading}
    />
  )
})

const OriginalNextImage = NextImage.default
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: any) => (
    <OriginalNextImage
      {...props}
      {...storybookImgLoader(props.src)}
      loading={isChromatic() ? 'eager' : props.loading}
    />
  )
})

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider
  },
  options: {
    storySort: (a: any, b: any) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true })
  }
}

export const decorators = [StoriesLayout]

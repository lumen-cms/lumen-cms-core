import * as React from 'react'
import { Story as StoryType, StoryContext } from '@storybook/react/types-6-0.d'
import '../../components/NamedComponents'
import '../../components/LazyNamedComponents'
import getBasicSettings from './basicSettings'
import CoreDecorator from './CoreDecorator'

// const OverwriteLink: FC = ({ children }) => {
//   return <a>{children}</a>
// }
// LmCoreComponents.lm_link_render = OverwriteLink

const ignoreOnKind = [
  'Landing Page/Website',
  'Design/Surfaces/Toolbar',
  'Design/Layout/Page',
  'Ecommerce/Shopify'
]

const StoriesLayout = (Story: StoryType, { kind }: StoryContext) => {
  if (ignoreOnKind.includes(kind)) {
    // we don't add additional markup on landing pages
    return <Story />
  }
  const settings = getBasicSettings()
  return (
    <CoreDecorator settings={settings}>
      <Story {...settings} />
    </CoreDecorator>
  )
}

export default StoriesLayout

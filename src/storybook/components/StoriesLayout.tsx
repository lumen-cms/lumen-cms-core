import { prepareLegacyControls } from '../legacyControls'
import { Decorator } from '@storybook/react'
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

const StoriesLayout: Decorator = (StoryFn, { title, id }) => {
  prepareLegacyControls(id)
  if (ignoreOnKind.includes(title)) {
    // we don't add additional markup on landing pages
    return <StoryFn />
  }
  const settings = getBasicSettings()
  return (
    <CoreDecorator settings={settings}>
      <StoryFn />
    </CoreDecorator>
  )
}

export default StoriesLayout

import * as React from 'react'
import Container from '@material-ui/core/Container'
import { Story as StoryType, StoryContext } from '@storybook/react/types-6-0.d'
import GlobalTheme from '../../components/global-theme/GlobalTheme'
import { getFontBasedOnSetting } from '../../utils/parseFont'
import AppProvider from '../../components/provider/AppProvider'
import '../../components/NamedComponents'
import '../../components/LazyNamedComponents'
import { LmAppProvidersContainer } from '../../components/layout/LmAppProvidersContainer'
import { SettingsPageProvider } from '../../components/provider/SettingsPageProvider'
import getBasicSettings from './basicSettings'
import {
  boolean,
  color,
  optionsKnob,
  select,
  text
} from '@storybook/addon-knobs'
import { CONFIG_STORYBOOK } from './configStorybook'
import { GlobalStoryblok } from '../../typings/generated/components-schema'

// const OverwriteLink: FC = ({ children }) => {
//   return <a>{children}</a>
// }
// LmCoreComponents.lm_link_render = OverwriteLink

const ignoreOnKind = [
  'Landing Page/Website',
  'Design/Surfaces/Toolbar',
  'Design/Layout/Page'
]

const StoriesLayout = (Story: StoryType, { kind }: StoryContext) => {
  if (ignoreOnKind.includes(kind)) {
    // we don't add additional markup on landing pages
    return <Story />
  }
  const settings = getBasicSettings()
  return (
    <AppProvider
      content={{
        allCategories: [],
        listWidgetData: {},
        allStaticContent: []
      }}
    >
      <SettingsPageProvider settings={settings as any} page={null}>
        <GlobalTheme>
          <LmAppProvidersContainer>
            <Container
              component="main"
              maxWidth={false}
              style={{ padding: '0px' }}
            >
              <Story {...settings} />
            </Container>
            <link href={getFontBasedOnSetting(settings)} rel="stylesheet" />
          </LmAppProvidersContainer>
        </GlobalTheme>
      </SettingsPageProvider>
    </AppProvider>
  )
}

export default StoriesLayout

import * as React from 'react'
import Header from './Header'
import {
  companyLogos,
  customSettings,
  simpleSettings
} from '../../../storybook/toolbar'
import { SettingsPageProvider } from '../../provider/SettingsPageProvider'
import StorybookPresetsContainer from '../../../storybook/components/StorybookPresetsContainer'

export default {
  title: 'Design/Surfaces/Toolbar'
}

export const Presets = () => (
  <StorybookPresetsContainer componentName="toolbar_row" />
)

export const Basic = () => (
  <>
    <h3>Default</h3>
    <SettingsPageProvider settings={simpleSettings}>
      <Header />
    </SettingsPageProvider>
    <h3>Secondary</h3>
    <SettingsPageProvider
      settings={{ ...simpleSettings, toolbar_variant: 'secondary' }}
    >
      <Header />
    </SettingsPageProvider>
    <h3>Dark</h3>
    <SettingsPageProvider
      settings={{ ...simpleSettings, toolbar_variant: 'dark' }}
    >
      <Header />
    </SettingsPageProvider>
    <h3>White</h3>
    <SettingsPageProvider
      settings={{ ...simpleSettings, toolbar_variant: 'white' }}
    >
      <Header />
    </SettingsPageProvider>
  </>
)
export const Custom = () => (
  <>
    <h3>Lumen Media</h3>
    <SettingsPageProvider
      settings={{ ...customSettings, website_logo: companyLogos[0] }}
    >
      <Header />
    </SettingsPageProvider>
    <h3>Baliinternships</h3>
    <SettingsPageProvider
      settings={{
        ...customSettings,
        toolbar_variant: 'secondary',
        website_logo: companyLogos[1]
      }}
    >
      <Header />
    </SettingsPageProvider>
    <h3>planet.training</h3>
    <SettingsPageProvider
      settings={{
        ...customSettings,
        toolbar_variant: 'secondary',
        website_logo: companyLogos[2]
      }}
    >
      <Header />
    </SettingsPageProvider>
  </>
)

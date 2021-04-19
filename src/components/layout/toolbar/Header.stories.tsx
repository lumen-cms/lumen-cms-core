import * as React from 'react'
import Header from './Header'
import { customSettings, simpleSettings } from '../../../storybook/toolbar'
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
  <SettingsPageProvider settings={customSettings}>
    <Header />
  </SettingsPageProvider>
)

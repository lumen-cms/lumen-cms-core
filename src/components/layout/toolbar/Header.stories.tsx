import * as React from 'react'
import Header from './Header'
import {
  companyLogos,
  customSettings,
  customSettingsSystemBar,
  simpleSettings
} from '../../../storybook/toolbar'
import { SettingsPageProvider } from '../../provider/SettingsPageProvider'
import StorybookPresetsContainer from '../../../storybook/components/StorybookPresetsContainer'
import GlobalTheme from '../../global-theme/GlobalTheme'

export default {
  title: 'Design/Surfaces/Toolbar'
}

export const Presets = () => (
  <SettingsPageProvider settings={simpleSettings}>
    <GlobalTheme>
      <StorybookPresetsContainer componentName="toolbar_row" />
    </GlobalTheme>
  </SettingsPageProvider>
)

export const Basic = () => (
  <>
    <h3>Default</h3>
    <SettingsPageProvider settings={simpleSettings}>
      <GlobalTheme>
        <Header />
      </GlobalTheme>
    </SettingsPageProvider>
    <h3>Secondary</h3>
    <SettingsPageProvider
      settings={{ ...simpleSettings, toolbar_variant: 'secondary' }}
    >
      <GlobalTheme>
        <Header />
      </GlobalTheme>
    </SettingsPageProvider>
    <h3>Dark</h3>
    <SettingsPageProvider
      settings={{ ...simpleSettings, toolbar_variant: 'dark' }}
    >
      <GlobalTheme>
        <Header />
      </GlobalTheme>
    </SettingsPageProvider>
    <h3>White</h3>
    <SettingsPageProvider
      settings={{ ...simpleSettings, toolbar_variant: 'white' }}
    >
      <GlobalTheme>
        <Header />
      </GlobalTheme>
    </SettingsPageProvider>
  </>
)
export const Custom = () => (
  <>
    <h3>Lumen Media</h3>
    <SettingsPageProvider
      settings={{ ...customSettings, website_logo: companyLogos[0] }}
    >
      <GlobalTheme>
        <Header />
      </GlobalTheme>
    </SettingsPageProvider>
    <h3>Baliinternships</h3>
    <SettingsPageProvider
      settings={{
        ...customSettings,
        toolbar_variant: 'secondary',
        website_logo: companyLogos[1]
      }}
    >
      <GlobalTheme>
        <Header />
      </GlobalTheme>
    </SettingsPageProvider>
    <h3>planet.training</h3>
    <SettingsPageProvider
      settings={{
        ...customSettings,
        toolbar_variant: 'secondary',
        website_logo: companyLogos[2]
      }}
    >
      <GlobalTheme>
        <Header />
      </GlobalTheme>
    </SettingsPageProvider>
  </>
)

export const ScrollCollapse = () => (
  <SettingsPageProvider
    settings={{
      ...customSettings,
      toolbar_variant: 'dark',
      toolbar_config: ['scroll_collapse', 'fixed', 'unelevated'],
      website_logo: companyLogos[3]
    }}
  >
    <GlobalTheme>
      <Header />
      <div style={{ height: '2000px', backgroundColor: '#ccc' }} />
    </GlobalTheme>
  </SettingsPageProvider>
)

export const FixedToolbar = () => (
  <SettingsPageProvider
    settings={{
      ...customSettings,
      toolbar_variant: 'dark',
      toolbar_config: ['fixed', 'unelevated'],
      website_logo: companyLogos[3]
    }}
  >
    <GlobalTheme>
      <Header />
      <div style={{ height: '2000px', backgroundColor: '#ccc' }} />
    </GlobalTheme>
  </SettingsPageProvider>
)

export const WithSystemBar = () => (
  <SettingsPageProvider
    settings={{
      ...customSettingsSystemBar,
      toolbar_variant: 'dark',
      toolbar_config: ['fixed', 'enable_system_bar'],
      website_logo: companyLogos[3]
    }}
  >
    <GlobalTheme>
      <Header />
      <div style={{ height: '2000px', backgroundColor: '#ccc' }} />
    </GlobalTheme>
  </SettingsPageProvider>
)

export const WithSystemBarScrollCollapse = () => (
  <SettingsPageProvider
    settings={{
      ...customSettingsSystemBar,
      toolbar_variant: 'dark',
      toolbar_config: ['fixed', 'enable_system_bar', 'scroll_collapse'],
      website_logo: companyLogos[3]
    }}
  >
    <GlobalTheme>
      <Header />
      <div style={{ height: '2000px', backgroundColor: '#ccc' }} />
    </GlobalTheme>
  </SettingsPageProvider>
)

export const CustomHeightSystemBar = () => (
  <SettingsPageProvider
    settings={{
      ...customSettingsSystemBar,
      toolbar_variant: 'dark',
      toolbar_main_height: 80,
      toolbar_config: ['fixed', 'enable_system_bar'],
      website_logo: companyLogos[3]
    }}
  >
    <GlobalTheme>
      <Header />
      <div style={{ height: '2000px', backgroundColor: '#ccc' }} />
    </GlobalTheme>
  </SettingsPageProvider>
)

export const CustomBaliinternships = () => (
  <SettingsPageProvider
    settings={{
      ...customSettingsSystemBar,
      toolbar_variant: 'dark',
      toolbar_main_height: 80,
      toolbar_config: ['fixed', 'enable_system_bar'],
      website_logo: companyLogos[1]
    }}
  >
    <GlobalTheme>
      <Header />
      <div style={{ height: '2000px', backgroundColor: '#ccc' }} />
    </GlobalTheme>
  </SettingsPageProvider>
)

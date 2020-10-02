import Header from '../src/components/layout/toolbar/Header'
import * as React from 'react'
import { customSettings, simpleSettings } from '../src/storybook/toolbar'

export default {
  title: 'Toolbar'
}

export const Basic = () => (
  <>
    <h3>Default</h3>
    <Header settings={simpleSettings} />
    <h3>Secondary</h3>
    <Header settings={{ ...simpleSettings, toolbar_variant: 'secondary' }} />
    <h3>Dark</h3>
    <Header settings={{ ...simpleSettings, toolbar_variant: 'dark' }} />
    <h3>White</h3>
    <Header settings={{ ...simpleSettings, toolbar_variant: 'white' }} />
  </>
)
export const Custom = () => <Header settings={customSettings} />

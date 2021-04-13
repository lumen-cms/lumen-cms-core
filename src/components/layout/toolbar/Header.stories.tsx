import * as React from 'react'
import Header from './Header'
import { customSettings, simpleSettings } from '../../../storybook/toolbar'

export default {
  title: 'Design/Surfaces/Toolbar'
}

// todo need to showcase different settings
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

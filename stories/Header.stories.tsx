import Header from '../src/components/layout/toolbar/Header'
import {  LmComponentRender as ComponentRender } from '../src/'
import * as React from 'react'
import { FunctionComponentFactory } from 'react'
import { customSettings, simpleSettings } from '../src/storybook/toolbar'

const LmComponentRender = ComponentRender as FunctionComponentFactory<any>

export default {
  title: 'Toolbar'
}

export const Basic = () => (
  <>
    <h3>Default</h3>
    <Header settings={simpleSettings} ComponentRender={LmComponentRender} />
    <h3>Secondary</h3>
    <Header settings={{ ...simpleSettings, toolbar_variant: 'secondary' }} ComponentRender={LmComponentRender} />
    <h3>Dark</h3>
    <Header settings={{ ...simpleSettings, toolbar_variant: 'dark' }} ComponentRender={LmComponentRender} />
    <h3>White</h3>
    <Header settings={{ ...simpleSettings, toolbar_variant: 'white' }} ComponentRender={LmComponentRender} />
  </>
)
export const Custom = () => (
  <Header settings={customSettings} ComponentRender={LmComponentRender} />
)

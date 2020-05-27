import * as React from 'react'
import { customSettings, customSettingsWithDrawer, simpleSettings } from '../src/storybook/toolbar'
import { toggleLeftNavigation } from '../src/utils/state/actions'
import MwcDrawer from '../src/components/layout/drawer/DrawerElement'
import Button from '@material-ui/core/Button'

const props = {
  ...simpleSettings
}

const custom = {
  ...customSettings
}

export default {
  title: 'Drawer'
}

export const Basic = () => (
  <>
    <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
    <MwcDrawer settings={props} />
  </>
)
export const Custom = () => (
  <>
    <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
    <MwcDrawer settings={custom} />
  </>
)
export const DedicatedDrawer = () => (
  <div>
    <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
    <MwcDrawer settings={customSettingsWithDrawer} />
  </div>
)


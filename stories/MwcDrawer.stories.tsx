import * as React from 'react'
import {
  customSettings,
  customSettingsWithDrawer,
  simpleSettings
} from '../src/storybook/toolbar'
import MwcDrawer from '../src/components/layout/drawer/DrawerElement'
import Button from '@material-ui/core/Button'
import {
  toggleLeftNavigationSelector,
  useNavigationStore
} from '../src/utils/state/navigationState'

const props = {
  ...simpleSettings
}

const custom = {
  ...customSettings
}

export default {
  title: 'Drawer'
}

export const Basic = () => {
  const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)

  return (
    <>
      <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
      <MwcDrawer settings={props} />
    </>
  )
}
export const Custom = () => {
  const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)

  return (
    <>
      <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
      <MwcDrawer settings={custom} />
    </>
  )
}
export const DedicatedDrawer = () => {
  const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)

  return (
    <div>
      <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
      <MwcDrawer settings={customSettingsWithDrawer} />
    </div>
  )
}

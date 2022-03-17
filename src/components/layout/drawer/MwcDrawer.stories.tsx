import Button from '@mui/material/Button'
import {
  customSettings,
  customSettingsWithDrawer,
  simpleSettings
} from '../../../storybook/toolbar'
import MwcDrawer from './DrawerElement'
import {
  toggleLeftNavigationSelector,
  useNavigationStore
} from '../../../utils/state/navigationState'
import SettingsPageProvider from '../../provider/SettingsPageProvider'

const props = {
  ...simpleSettings
}

const custom = {
  ...customSettings
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Navigation/Drawer'
}

export const Basic = () => {
  const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)

  return (
    <>
      <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
      <SettingsPageProvider settings={{ ...props }}>
        <MwcDrawer />
      </SettingsPageProvider>
    </>
  )
}
export const Custom = () => {
  const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)

  return (
    <>
      <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
      <SettingsPageProvider settings={custom}>
        <MwcDrawer />
      </SettingsPageProvider>
    </>
  )
}
export const DedicatedDrawer = () => {
  const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)

  return (
    <div>
      <Button onClick={() => toggleLeftNavigation()}>Toggle Drawer</Button>
      <SettingsPageProvider settings={customSettingsWithDrawer}>
        <MwcDrawer />
      </SettingsPageProvider>
    </div>
  )
}

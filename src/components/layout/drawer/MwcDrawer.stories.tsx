import Button from '@material-ui/core/Button'
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

const props = {
  ...simpleSettings
}

const custom = {
  ...customSettings
}

export default {
  title: 'ToDo/Drawer'
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

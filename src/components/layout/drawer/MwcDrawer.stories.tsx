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
import { AppContext } from '../../provider/context/AppContext'
import { DrawerButton } from './DrawerButton'
import { expect, userEvent, within } from 'storybook/test'

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

export const SelectedLink = {
  render: () => (
    <AppContext.Provider
      value={{
        slug: '/selected',
        locale: 'en',
        defaultLocale: 'en',
        locales: ['en'],
        insideStoryblok: false
      }}
    >
      <div style={{ width: 285 }}>
        <DrawerButton
          content={{
            _uid: 'selected-drawer-link',
            component: 'button',
            label: 'Selected link',
            link: {
              fieldtype: 'multilink',
              id: '',
              url: '',
              linktype: 'story',
              cached_url: 'selected'
            }
          }}
        />
      </div>
    </AppContext.Provider>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const link = await within(canvasElement).findByRole('link', {
      name: 'Selected link'
    })
    await expect(link).toHaveClass('Mui-selected', 'MuiButtonBase-root')
    const selectedBackground = getComputedStyle(link).backgroundColor
    await expect(selectedBackground).not.toBe('rgba(0, 0, 0, 0)')
    await expect(link.getBoundingClientRect().height).toBe(48)
    await userEvent.tab()
    await expect(link).toHaveFocus()
  }
}

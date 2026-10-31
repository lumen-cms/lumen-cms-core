import dynamic from 'next/dynamic'
import MwcDrawer from './MwcDrawer'
import useBackgroundBox from '../../section/useBackgroundBox'
import { useSettings } from '../../provider/SettingsPageProvider'

const DrawerContent = dynamic(() => import('./DrawerContent'))

export default function DrawerElement() {
  const settings = useSettings()
  const background = Array.isArray(settings.drawer_background)
    ? settings.drawer_background[0]
    : undefined
  const backgroundProps = useBackgroundBox({ background })

  return (
    <MwcDrawer backgroundProps={backgroundProps}>
      <DrawerContent />
    </MwcDrawer>
  )
}

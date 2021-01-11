import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'
import MenuUi from 'mdi-material-ui/Menu'
import AppsIcon from 'mdi-material-ui/Apps'
import LmIcon from '../../icon/LmIcon'
import { LmToggleDrawerButtonProps } from './toolbarTypes'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import {
  toggleLeftNavigationSelector,
  toggleRightNavigationSelector,
  useNavigationStore
} from '../../../utils/state/navigationState'

export function LmToggleDrawerButton({
  content
}: LmToggleDrawerButtonProps): JSX.Element | null {
  const settings = useSettings()
  const page = usePage()

  const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)
  const toggleRightNavigation = useNavigationStore(
    toggleRightNavigationSelector
  )
  const rightDrawerMediaBreakpoint = page?.mobile_breakpoint
  const leftDrawerMediaBreakpoint = settings.mobile_nav_breakpoint
  const rightDrawer = content.is_right_drawer
  const hasRightDrawer = page?.right_body?.length

  if (rightDrawer && !hasRightDrawer) {
    return null // if no right drawer on page hide
  }
  const breakpointClass = rightDrawer
    ? rightDrawerMediaBreakpoint || 'sm'
    : leftDrawerMediaBreakpoint || 'sm'

  return (
    <IconButton
      aria-label={rightDrawer ? 'Drawer right toggle' : 'Drawer left toggle'}
      className={clsx(content.class_names?.values, {
        [`d-${breakpointClass}-none`]: !content.force_show
      })}
      style={{
        width: 'max-content'
      }}
      onClick={() =>
        rightDrawer ? toggleRightNavigation() : toggleLeftNavigation()
      }
    >
      {content.icon?.name ? (
        <LmIcon iconName={content.icon.name} />
      ) : rightDrawer ? (
        <AppsIcon />
      ) : (
        <MenuUi />
      )}
    </IconButton>
  )
}

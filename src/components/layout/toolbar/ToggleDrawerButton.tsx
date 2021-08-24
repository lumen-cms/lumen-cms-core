import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'
import MenuUi from 'mdi-material-ui/Menu'
import AppsIcon from 'mdi-material-ui/Apps'
import CloseIcon from 'mdi-material-ui/Close'
import shallow from 'zustand/shallow'
import LmIcon from '../../icon/LmIcon'
import { LmToggleDrawerButtonProps } from './toolbarTypes'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import { useNavigationStore } from '../../../utils/state/navigationState'
import { LmComponentRender } from '@LmComponentRender'

const useDrawer = () =>
  useNavigationStore(
    (state) => ({
      toggleLeftNavigation: state.toggleLeftDrawer,
      toggleRightNavigation: state.toggleRightDrawer,
      isLeftOpen: state.leftNavigationDrawer,
      isRightOpen: state.rightNavigationDrawer
    }),
    shallow
  )

export function LmToggleDrawerButton({
  content
}: LmToggleDrawerButtonProps): JSX.Element | null {
  const settings = useSettings()
  const page = usePage()
  const {
    isLeftOpen,
    isRightOpen,
    toggleLeftNavigation,
    toggleRightNavigation
  } = useDrawer()
  // const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)
  // const toggleRightNavigation = useNavigationStore(
  //   toggleRightNavigationSelector
  // )
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

  const ActiveIcon = () =>
    content.icon?.name ? (
      <LmIcon iconName={content.icon.name} />
    ) : rightDrawer ? (
      <AppsIcon />
    ) : (
      <MenuUi />
    )
  return content.button?.length ? (
    <LmComponentRender
      content={content.button[0]}
      additionalClassName={clsx({
        [`d-${breakpointClass}-none`]: !content.force_show
      })}
      onClick={() => {
        rightDrawer ? toggleRightNavigation() : toggleLeftNavigation()
      }}
    />
  ) : (
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
      {rightDrawer ? (
        isRightOpen ? (
          <CloseIcon />
        ) : (
          <ActiveIcon />
        )
      ) : isLeftOpen ? (
        <CloseIcon />
      ) : (
        <ActiveIcon />
      )}
    </IconButton>
  )
}

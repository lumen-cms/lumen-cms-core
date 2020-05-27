import React from 'react'
import { ToolbarNaviButtonStoryblok } from '../../../typings/generated/components-schema'
import IconButton from '@material-ui/core/IconButton'
import clsx from 'clsx'
import { toggleLeftNavigation, toggleRightNavigation } from '../../../utils/state/actions'
import LmIcon from '../../icon/LmIcon'
import MenuUi from 'mdi-material-ui/Menu'
import AppsIcon from 'mdi-material-ui/Apps'
import { useAppSetup } from '../../provider/AppSetupProvider'


export type LmToggleDrawerButtonProps = { content: ToolbarNaviButtonStoryblok }

export function LmToggleDrawerButton({ content }: LmToggleDrawerButtonProps): JSX.Element | null {
  const rightDrawer = content.is_right_drawer
  const { rightDrawerMediaBreakpoint, leftDrawerMediaBreakpoint, hasRightDrawer } = useAppSetup()
  if (rightDrawer && !hasRightDrawer) {
    return null // if no right drawer on page hide
  }

  const breakpointClass = rightDrawer ? (rightDrawerMediaBreakpoint || 'sm') : (leftDrawerMediaBreakpoint || 'sm')

  return (
    <IconButton className={clsx(content.class_names?.values, {
      [`d-${breakpointClass}-none`]: !content.force_show
    })}
                style={{
                  width: 'max-content'
                }}
                onClick={() => rightDrawer ? toggleRightNavigation() : toggleLeftNavigation()}>
      {content.icon?.name ? <LmIcon iconName={content.icon.name} /> : (rightDrawer ? <AppsIcon /> : <MenuUi />)}
    </IconButton>
  )
}


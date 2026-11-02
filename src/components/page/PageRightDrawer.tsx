import dynamic from 'next/dynamic'
import { useState, type ReactNode } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { PageStoryblok } from '../../typings/generated/components-schema'
import {
  closeRightNavigationSelector,
  rightNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const RightDrawerContent = dynamic(() => import('./RightDrawerContent'))

export function PageRightDrawer({
  rightBody,
  mobileBreakpoint,
  headerSpace
}: {
  rightBody: NonNullable<PageStoryblok['right_body']>
  mobileBreakpoint?: PageStoryblok['mobile_breakpoint']
  headerSpace?: ReactNode
}) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up(mobileBreakpoint || 'sm'))
  const rightIsOpen = useNavigationStore(rightNavigationDrawerSelector)
  const closeRightNavigation = useNavigationStore(closeRightNavigationSelector)
  const [mountedOnce, setMountedOnce] = useState(false)
  if ((matches || rightIsOpen) && !mountedOnce) setMountedOnce(true)

  // Permanent drawers render immediately; temporary drawers wait for first open.
  if (!matches && !rightIsOpen && !mountedOnce) return null

  return (
    <RightDrawerContent
      rightBody={rightBody}
      headerSpace={headerSpace}
      matches={matches}
      rightIsOpen={rightIsOpen}
      closeRightNavigation={closeRightNavigation}
    />
  )
}

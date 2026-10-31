import dynamic from 'next/dynamic'
import { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { PageStoryblok } from '../../typings/generated/components-schema'
import { usePage } from '../provider/SettingsPageProvider'
import {
  closeRightNavigationSelector,
  rightNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const RightDrawerContent = dynamic(() => import('./RightDrawerContent'))

export default function RightDrawer({
  rightBody
}: {
  rightBody: NonNullable<PageStoryblok['right_body']>
}) {
  const theme = useTheme()
  const page = usePage()
  const matches = useMediaQuery(
    theme.breakpoints.up(page?.mobile_breakpoint || 'sm')
  )
  const rightIsOpen = useNavigationStore(rightNavigationDrawerSelector)
  const closeRightNavigation = useNavigationStore(closeRightNavigationSelector)
  const [mountedOnce, setMountedOnce] = useState(false)
  if ((matches || rightIsOpen) && !mountedOnce) setMountedOnce(true)

  // Permanent drawers render immediately; temporary drawers wait for first open.
  if (!matches && !rightIsOpen && !mountedOnce) return null

  return (
    <RightDrawerContent
      rightBody={rightBody}
      matches={matches}
      rightIsOpen={rightIsOpen}
      closeRightNavigation={closeRightNavigation}
    />
  )
}

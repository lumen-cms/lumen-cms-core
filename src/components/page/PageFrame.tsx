import type {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import type { PropsWithChildren, ReactNode } from 'react'
import { LmComponentRender } from '../CoreComponents'
import Box from '@mui/material/Box'
import {
  contentSx,
  contentWithRightSx,
  leftMobileSx,
  leftShiftSx,
  rightMobileSx
} from './pageStyles'
import {
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

export type PageFrameProps = PropsWithChildren<{
  hasRightDrawer?: boolean
  mobileBreakpoint?: PageStoryblok['mobile_breakpoint']
  mobileNavBreakpoint?: GlobalStoryblok['mobile_nav_breakpoint']
  promotion?: ReactNode
}>

export function PageFrame({
  children,
  hasRightDrawer,
  mobileBreakpoint,
  mobileNavBreakpoint,
  promotion
}: PageFrameProps) {
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const isOpen = useNavigationStore(leftNavigationDrawerSelector)
  const isLeftShift = drawerVariant !== 'temporary' && isOpen
  return (
    <Box
      component="main"
      sx={[
        contentSx,
        !!hasRightDrawer && contentWithRightSx,
        rightMobileSx[mobileBreakpoint || 'sm'] ?? false,
        isLeftShift && leftShiftSx,
        isLeftShift && (leftMobileSx[mobileNavBreakpoint || 'sm'] ?? false)
      ]}
    >
      {promotion}
      {children}
    </Box>
  )
}
PageFrame.displayName = 'PageFrame'

export type PageBodyProps = {
  body: NonNullable<PageStoryblok['body']>
}

export function PageBody({ body }: PageBodyProps): React.JSX.Element {
  return (
    <>
      {body.map((blok, iteration) => (
        <LmComponentRender
          content={blok}
          key={blok._uid}
          sectionPosition={iteration}
        />
      ))}
    </>
  )
}

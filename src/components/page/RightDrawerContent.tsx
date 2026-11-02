import type { PageStoryblok } from '../../typings/generated/components-schema'
import React, { FunctionComponent } from 'react'
import Drawer from '@mui/material/Drawer'
import { LmComponentRender } from '../CoreComponents'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { rightDrawerPaperSx, rightModalSx } from './pageStyles'
type RightDrawerState = {
  matches: boolean
  rightIsOpen: boolean
  closeRightNavigation: () => void
}

const RightDrawerContainer: FunctionComponent<
  React.PropsWithChildren<RightDrawerState>
> = ({ children, matches, rightIsOpen, closeRightNavigation }) => {
  const theme = useTheme()
  return (
    <Drawer
      variant={!matches ? 'temporary' : 'permanent'}
      anchor="right"
      sx={rightModalSx}
      slotProps={{
        paper: {
          sx: [
            matches && {
              width: theme.drawer.right,
              zIndex: theme.zIndex.appBar - 1
            },
            rightDrawerPaperSx
          ]
        }
      }}
      open={!matches ? rightIsOpen : true}
      onClose={closeRightNavigation}
    >
      {children}
    </Drawer>
  )
}
RightDrawerContainer.displayName = 'RightDrawerContainer'

type RightDrawerProps = {
  rightBody: NonNullable<PageStoryblok['right_body']>
  headerSpace?: React.ReactNode
  // body: any[]
}

function RightDrawerContent({
  rightBody,
  headerSpace,
  ...state
}: RightDrawerProps & RightDrawerState): React.JSX.Element {
  return (
    <RightDrawerContainer {...state}>
      {headerSpace}
      <Box sx={{ overflowY: 'auto' }}>
        {rightBody.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </Box>
    </RightDrawerContainer>
  )
}

export default RightDrawerContent

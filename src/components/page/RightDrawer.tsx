import React, { FunctionComponent } from 'react'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LmComponentRender } from '../CoreComponents'
import { ContentSpace } from '../layout/ContentSpace'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { rightDrawerPaperSx, rightModalSx } from './pageStyles'
import { usePage } from '../provider/SettingsPageProvider'
import {
  closeRightNavigationSelector,
  rightNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const RightDrawerContainer: FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const theme = useTheme()
  const closeRightNavigation = useNavigationStore(closeRightNavigationSelector)
  const page = usePage()
  const matches = useMediaQuery(
    theme.breakpoints.up(page?.mobile_breakpoint || 'sm')
  )
  const rightIsOpen = useNavigationStore(rightNavigationDrawerSelector)
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
  rightBody: any[]
  // body: any[]
}

function RightDrawer({ rightBody }: RightDrawerProps): React.JSX.Element {
  return (
    <RightDrawerContainer>
      <ContentSpace />
      <Box sx={{ overflowY: 'auto' }}>
        {rightBody.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </Box>
    </RightDrawerContainer>
  )
}

export default RightDrawer

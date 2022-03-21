import React, { FunctionComponent } from 'react'
import Drawer from '@mui/material/Drawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LmComponentRender } from '@LmComponentRender'
import { ContentSpace } from '../layout/ContentSpace'
import { usePageStyles } from './usePageStyle'
import { usePage } from '../provider/SettingsPageProvider'
import {
  closeRightNavigationSelector,
  rightNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const RightDrawerContainer: FunctionComponent = ({ children }) => {
  const { classes, theme } = usePageStyles()
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
      sx={{
        '.MuiDrawer-paperAnchorDockedRight': {
          width: theme.drawer.right,
          zIndex: theme.zIndex.appBar - 1
        }
      }}
      classes={{
        paper: classes.rightDrawerPaper,
        modal: classes.rightModal
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

function RightDrawer({ rightBody }: RightDrawerProps): JSX.Element {
  const { classes } = usePageStyles()

  return (
    <RightDrawerContainer>
      <ContentSpace />
      <div className={classes.rightContent}>
        {rightBody.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </div>
    </RightDrawerContainer>
  )
}

export default RightDrawer

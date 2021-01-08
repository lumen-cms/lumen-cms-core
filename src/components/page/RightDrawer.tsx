import React, { FunctionComponent } from 'react'
import Drawer from '@material-ui/core/Drawer'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { LmComponentRender } from '@LmComponentRender'
import { ContentSpace } from '../layout/ContentSpace'
import { usePageStyles } from './usePageStyle'
import { useAppStore } from '../../utils/state/appState'
import {
  closeRightNavigationSelector,
  rightNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const RightDrawerContainer: FunctionComponent = ({ children }) => {
  const classes = usePageStyles()
  const theme = useTheme()
  const closeRightNavigation = useNavigationStore(closeRightNavigationSelector)
  const page = useAppStore((state) => state.page)
  const matches = useMediaQuery(
    theme.breakpoints.up(page?.mobile_breakpoint || 'sm')
  )
  const rightIsOpen = useNavigationStore(rightNavigationDrawerSelector)
  return (
    <Drawer
      variant={!matches ? 'temporary' : 'permanent'}
      anchor="right"
      classes={{
        paper: classes.rightDrawerPaper,
        modal: classes.rightModal,
        paperAnchorDockedRight: classes.rightDocked
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
  const classes = usePageStyles()

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

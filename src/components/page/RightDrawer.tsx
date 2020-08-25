import React, { FunctionComponent } from 'react'
import Drawer from '@material-ui/core/Drawer'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { useGlobalState } from '../../utils/state/state'
import { closeNavigationDrawers } from '../../utils/state/actions'
import ContentSpace from '../layout/ContentSpace'
import { usePageStyles } from './usePageStyle'
import { useAppSetup } from '../provider/context/AppSetupContext'
import { LmComponentRender } from '../CoreComponents'

const RightDrawerContainer: FunctionComponent = ({ children }) => {
  const classes = usePageStyles()
  const theme = useTheme()
  const appSetup = useAppSetup()
  const matches = useMediaQuery(
    theme.breakpoints.up(appSetup.rightDrawerMediaBreakpoint || 'sm')
  )

  // const { isMobile } = useDeviceDimensions()
  const [rightIsOpen] = useGlobalState('rightNavigationDrawer')
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
      onClose={() => closeNavigationDrawers()}
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
        {rightBody.map((blok, i) => LmComponentRender({ content: blok, i }))}
      </div>
    </RightDrawerContainer>
  )
}

export default RightDrawer

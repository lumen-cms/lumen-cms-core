import { FunctionComponent } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import Box from '@mui/material/Box'
import {
  contentSx,
  contentWithRightSx,
  leftMobileSx,
  leftShiftSx,
  rightMobileSx
} from './pageStyles'
import { usePage, useSettings } from '../provider/SettingsPageProvider'
import {
  drawerVariantSelector,
  leftNavigationDrawerSelector,
  useNavigationStore
} from '../../utils/state/navigationState'

const MainContentContainer: FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const settings = useSettings()
  const page = usePage()
  const drawerVariant = useNavigationStore(drawerVariantSelector)
  const isOpen = useNavigationStore(leftNavigationDrawerSelector)
  const hasRightDrawer = page?.right_body?.length
  const isLeftShift = drawerVariant !== 'temporary' && isOpen
  return (
    <Box
      component="main"
      sx={[
        contentSx,
        !!hasRightDrawer && contentWithRightSx,
        rightMobileSx[page?.mobile_breakpoint || 'sm'] ?? false,
        isLeftShift && leftShiftSx,
        isLeftShift &&
          (leftMobileSx[settings.mobile_nav_breakpoint || 'sm'] ?? false)
      ]}
    >
      {!page.property?.includes('has_feature') &&
        !page.property?.includes('disable_promotion') &&
        settings.promotion?.map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      {children}
    </Box>
  )
}
MainContentContainer.displayName = 'MainContentContainer'

type MainContentProps = {
  body: any[]
}

export function MainContent({ body }: MainContentProps): React.JSX.Element {
  return (
    <MainContentContainer>
      {body.map((blok, iteration) => (
        <LmComponentRender
          content={blok}
          key={blok._uid}
          sectionPosition={iteration}
        />
      ))}
    </MainContentContainer>
  )
}

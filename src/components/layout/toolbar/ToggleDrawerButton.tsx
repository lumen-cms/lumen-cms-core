import IconButton from '@mui/material/IconButton'
import MenuUi from 'mdi-material-ui/Menu'
import AppsIcon from 'mdi-material-ui/Apps'
import CloseIcon from 'mdi-material-ui/Close'
import { useShallow } from 'zustand/react/shallow'
import LmIcon from '../../icon/LmIcon'
import { LmToggleDrawerButtonProps } from './toolbarTypes'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import { useNavigationStore } from '../../../utils/state/navigationState'
import { LmComponentRender } from '../../CoreComponents'
import clsx from 'clsx'

const useDrawer = () =>
  useNavigationStore(
    useShallow((state) => ({
      toggleLeftNavigation: state.toggleLeftDrawer,
      toggleRightNavigation: state.toggleRightDrawer,
      isLeftOpen: state.leftNavigationDrawer,
      isRightOpen: state.rightNavigationDrawer
    }))
  )

function ActiveIcon({ content }: LmToggleDrawerButtonProps) {
  return content.icon?.name ? (
    <LmIcon iconName={content.icon.name} />
  ) : content.is_right_drawer ? (
    <AppsIcon />
  ) : (
    <MenuUi />
  )
}

function DrawerToggleControl({
  content,
  breakpointClass,
  isOpen,
  onToggle
}: LmToggleDrawerButtonProps & {
  breakpointClass: string
  isOpen: boolean
  onToggle: () => void
}) {
  return content.button?.length ? (
    <LmComponentRender
      content={content.button[0]}
      additionalClassName={clsx({
        [`d-${breakpointClass}-none`]: !content.force_show
      })}
      onClick={onToggle}
    />
  ) : (
    <IconButton
      aria-label={
        content.is_right_drawer ? 'Drawer right toggle' : 'Drawer left toggle'
      }
      className={clsx(content.class_names?.values, {
        [`d-${breakpointClass}-none`]: !content.force_show
      })}
      style={{
        width: 'max-content'
      }}
      onClick={onToggle}
      size="large"
    >
      {isOpen ? <CloseIcon /> : <ActiveIcon content={content} />}
    </IconButton>
  )
}

export function LmToggleDrawerButton({
  content
}: LmToggleDrawerButtonProps): React.JSX.Element | null {
  const settings = useSettings()
  const page = usePage()

  const {
    isLeftOpen,
    isRightOpen,
    toggleLeftNavigation,
    toggleRightNavigation
  } = useDrawer()
  // const toggleLeftNavigation = useNavigationStore(toggleLeftNavigationSelector)
  // const toggleRightNavigation = useNavigationStore(
  //   toggleRightNavigationSelector
  // )
  const rightDrawerMediaBreakpoint = page?.mobile_breakpoint
  const leftDrawerMediaBreakpoint = settings.mobile_nav_breakpoint
  const rightDrawer = content.is_right_drawer
  const hasRightDrawer = page?.right_body?.length

  if (rightDrawer && !hasRightDrawer) {
    return null // if no right drawer on page hide
  }
  const breakpointClass = rightDrawer
    ? rightDrawerMediaBreakpoint || 'sm'
    : leftDrawerMediaBreakpoint || 'sm'

  return (
    <DrawerToggleControl
      content={content}
      breakpointClass={breakpointClass}
      isOpen={rightDrawer ? isRightOpen : isLeftOpen}
      onToggle={rightDrawer ? toggleRightNavigation : toggleLeftNavigation}
    />
  )
}

import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import BottomNavigation from '@mui/material/BottomNavigation'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import { getAdvancedSx } from '../../utils/hooks/useStylesAdvanced'
import {
  LmBottomNavigationItemProps,
  LmBottomNavigationProps
} from './bottomNavigationTypes'
import { getLinkAttrs, isValidLink, LinkType } from '../../utils/linkHandler'
import { useTheme } from '@mui/material/styles'

export default function LmBottomNavigation({
  content
}: LmBottomNavigationProps) {
  const theme = useTheme()
  const advancedSx = getAdvancedSx({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  const bodyElements: LmBottomNavigationItemProps[] = content.body || []
  return (
    <BottomNavigation
      showLabels
      sx={[
        {
          ...(content.stick_to_bottom && {
            width: '100%',
            position: 'fixed',
            bottom: 0,
            zIndex: theme.zIndex.snackbar
          })
        },
        advancedSx
      ]}
    >
      {bodyElements.map((item) => {
        const btnProps: any = isValidLink(item.link as LinkType)
          ? {
              ...getLinkAttrs(item.link as LinkType, {
                openExternal: !!item.open_external
              }),
              naked: true,
              component: LmCoreComponents.lm_link_render
            }
          : {}
        return (
          <BottomNavigationAction
            key={item._uid}
            {...btnProps}
            label={
              Array.isArray(item.label) && item.label[0] ? (
                <LmComponentRender content={item.label[0]} />
              ) : undefined
            }
            icon={
              Array.isArray(item.icon) && item.icon[0] ? (
                <LmComponentRender content={item.icon[0]} />
              ) : undefined
            }
            showLabel={item.content?.show_label}
          />
        )
      })}
    </BottomNavigation>
  )
}

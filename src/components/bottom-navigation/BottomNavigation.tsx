import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { LmComponentRender } from '@LmComponentRender'
import clsx from 'clsx'
import { LmCoreComponents } from '@CONFIG'
import {
  LmBottomNavigationItemProps,
  LmBottomNavigationProps
} from './bottomNavigationTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    zIndex: theme.zIndex.snackbar
  }
}))

export default function LmBottomNavigation({
  content
}: LmBottomNavigationProps) {
  const classes = useStyles()
  const classesAdvanced = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet
  })
  const bodyElements: LmBottomNavigationItemProps[] = content.body || []
  return (
    <BottomNavigation
      showLabels
      className={clsx({
        [classes.root]: content.stick_to_bottom,
        [classesAdvanced.advanced]: content.styles?.length,
        [classesAdvanced.advancedMobile]: content.styles_mobile?.length,
        [classesAdvanced.advancedTablet]: content.styles_tablet?.length
      })}
    >
      {bodyElements.map((item) => {
        const btnProps: any =
          item.link?.cached_url || item.link?.url || item.link?.email
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
            onClick={() => {
              console.log('on change')
            }}
            label={
              item.label ? (
                <LmComponentRender content={item.label[0]} />
              ) : undefined
            }
            icon={
              item.icon ? (
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

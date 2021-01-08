import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import useScrollTop from '../../utils/hooks/useScrollTop'
import { ContentSpaceProps } from './layoutTypes'
import {
  pageSelector,
  settingsSelector,
  useAppStore
} from '../../utils/state/appState'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentSpace: {
      height: theme.toolbar.height.mobile,
      transitionDuration: '500ms',
      [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
        height: theme.toolbar.height.landscape + theme.toolbar.height.systemBar
      },
      [theme.breakpoints.up('sm')]: {
        height: theme.toolbar.height.custom
          ? Math.round(theme.toolbar.height.custom * 1.15) +
            theme.toolbar.height.systemBar
          : theme.toolbar.height.desktop + theme.toolbar.height.systemBar
      },
      '&.lm-scrolled': {
        height: theme.toolbar.height.mobile,
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
          height: theme.toolbar.height.landscape // + theme.toolbar.height.systemBar
        },
        [theme.breakpoints.up('sm')]: {
          height: theme.toolbar.height.desktop // + theme.toolbar.height.systemBar
        }
      },
      '&.lm-is-table': {
        display: 'inline-table'
      }
    }
  })
)

export function ContentSpace({ isBlock }: ContentSpaceProps): JSX.Element {
  const classes = useStyles()
  const settings = useAppStore(settingsSelector)
  const page = useAppStore(pageSelector)
  const scrolledWithoutHysteresis = useScrollTop()

  return (
    <div
      className={clsx('lm-content-space', classes.contentSpace, {
        'lm-is-table': !isBlock,
        'lm-scrolled':
          scrolledWithoutHysteresis &&
          (settings.toolbar_main_height ||
            page?.property?.includes('has_feature'))
      })}
    />
  )
}

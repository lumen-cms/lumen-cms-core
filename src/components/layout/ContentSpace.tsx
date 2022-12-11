import React from 'react'
import useScrollTop from '../../utils/hooks/useScrollTop'
import { ContentSpaceProps } from './layoutTypes'
import { usePage, useSettings } from '../provider/SettingsPageProvider'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import clsx from 'clsx'

export function ContentSpace({ isBlock }: ContentSpaceProps): JSX.Element {
  const theme = useTheme()
  const settings = useSettings()
  const page = usePage()
  const scrolledWithoutHysteresis = useScrollTop()

  return (
    <Box
      sx={{
        height: theme.toolbar.height.mobile,
        transitionDuration: '500ms',
        [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
          height:
            theme.toolbar.height.landscape + theme.toolbar.height.systemBar
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
      }}
      className={clsx('lm-content-space', {
        'lm-is-table': !isBlock,
        'lm-scrolled': !!(
          scrolledWithoutHysteresis &&
          (settings.toolbar_main_height ||
            page?.property?.includes('has_feature'))
        )
      })}
    />
  )
}

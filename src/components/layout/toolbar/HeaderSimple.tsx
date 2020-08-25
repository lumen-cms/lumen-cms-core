import React from 'react'
import clsx from 'clsx'
import Grid from '@material-ui/core/Grid'
import TopAppBarWrap, { AppHeaderProps } from './TopAppBar'
import {
  GlobalStoryblok,
  ToolbarNaviButtonStoryblok
} from '../../../typings/generated/components-schema'
import { LmComponentRender } from '../../CoreComponents'

type HeaderSimpleProps = AppHeaderProps

function HeaderSimple(props: HeaderSimpleProps): JSX.Element {
  const { settings } = props

  const content: GlobalStoryblok = settings || ({} as GlobalStoryblok)
  const mobileNavBreakpoint = content.mobile_nav_breakpoint || 'sm'
  const navRight = content.toolbar || []
  navRight.push({ component: 'toolbar_navi_button', is_right_drawer: true })
  return (
    <TopAppBarWrap {...props}>
      <LmComponentRender
        content={
          { component: 'toolbar_navi_button' } as ToolbarNaviButtonStoryblok
        }
      />
      <LmComponentRender
        content={{ component: 'toolbar_logo' }}
        settings={content}
      />

      {navRight.length > 0 && (
        <Grid
          container
          className={clsx('lm-toolbar__section', 'd-none', {
            [`d-${mobileNavBreakpoint}-inline-flex`]: true
          })}
        >
          {navRight.map((blok, i) => LmComponentRender({ content: blok, i }))}
        </Grid>
      )}
    </TopAppBarWrap>
  )
}

export default HeaderSimple

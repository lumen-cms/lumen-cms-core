import React, { FunctionComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { LmComponentRender } from '@LmComponentRender'
import { ToolbarRowSectionStoryblok } from '../../../typings/generated/components-schema'
import { LmToolbarSectionProps } from './toolbarTypes'
import { useSettings } from '../../provider/SettingsPageProvider'

const ToolbarSectionContainer: FunctionComponent<{
  content: ToolbarRowSectionStoryblok
}> = ({ children, content }) => {
  const { align } = content
  const theme = useTheme()
  const settings = useSettings()
  const matches = useMediaQuery(
    theme.breakpoints.up(settings?.mobile_nav_breakpoint || 'sm')
  )

  const hideOnMediaQuery = content.use_media_query && !matches
  const invHideOnMediaQuery = content.inv_use_media_query && matches
  return (
    <Grid
      item
      className={clsx(content.class_names?.values, {
        'h-100': !align,
        'd-inline-flex':
          !content.align && !hideOnMediaQuery && !invHideOnMediaQuery,
        'd-none': hideOnMediaQuery || invHideOnMediaQuery
      })}
      style={{
        alignItems: !align ? 'center' : undefined,
        alignSelf: align || 'center'
      }}
    >
      {children}
    </Grid>
  )
}
ToolbarSectionContainer.displayName = 'ToolbarSectionContainer'

export function LmToolbarSection({
  content
}: LmToolbarSectionProps): JSX.Element {
  const body = content.body || []
  return (
    <ToolbarSectionContainer content={content}>
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </ToolbarSectionContainer>
  )
}

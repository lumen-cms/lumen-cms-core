import React, { FunctionComponent } from 'react'
import Grid from '@material-ui/core/Grid'
import clsx from 'clsx'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useAppSetup } from '../../provider/context/AppSetupContext'
import {
  GlobalStoryblok,
  ToolbarRowSectionStoryblok
} from '../../../typings/generated/components-schema'
import { useAppContext } from '../../provider/context/AppContext'

const ToolbarSectionContainer: FunctionComponent<{
  content: ToolbarRowSectionStoryblok
}> = ({ children, content }) => {
  const { align } = content
  const theme = useTheme()
  const appSetup = useAppSetup()
  const matches = useMediaQuery(
    theme.breakpoints.up(appSetup.leftDrawerMediaBreakpoint || 'sm')
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

export type LmToolbarSectionProps = {
  content: ToolbarRowSectionStoryblok
  settings: GlobalStoryblok
}

export function LmToolbarSection({
  settings,
  content
}: LmToolbarSectionProps): JSX.Element {
  const body = content.body || []
  const { ComponentRender } = useAppContext()
  return (
    <ToolbarSectionContainer content={content}>
      {body.map((blok, i) => ComponentRender({ content: blok, settings, i }))}
    </ToolbarSectionContainer>
  )
}

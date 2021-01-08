import React from 'react'
import Container, { ContainerProps } from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import { LmComponentRender } from '@LmComponentRender'
import { LmToolbarRowProps } from './toolbarTypes'
import { settingsSelector, useAppStore } from '../../../utils/state/appState'

export function LmToolbarRow({ content }: LmToolbarRowProps): JSX.Element {
  const settings = useAppStore(settingsSelector)
  const body = content.body || []
  const theme = useTheme()

  if (content.is_system_bar) {
    const toolbarConfig = settings.toolbar_config || []
    let toolbarWidth: ContainerProps['maxWidth'] = false
    if (toolbarConfig.includes('fixed_width')) {
      toolbarWidth =
        settings.theme_container_width &&
        settings.theme_container_width !== 'none'
          ? settings.theme_container_width
          : 'lg'
    }
    return (
      <div
        className="lm-system-bar"
        style={{
          backgroundColor:
            (content.background_color && content.background_color.rgba) ||
            theme.palette.primary.main
          // height: `${content.height || 40}px`
        }}
      >
        <Container
          className="h-100"
          maxWidth={toolbarWidth as ContainerProps['maxWidth']}
        >
          <Grid
            container
            className="h-100"
            justify={content.justify || 'space-between'}
            alignContent="center"
            alignItems="center"
          >
            {body.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Grid>
        </Container>
      </div>
    )
  }

  return (
    <Grid
      container
      justify={content.justify || 'space-between'}
      className="h-100"
      alignItems="center"
    >
      {body.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </Grid>
  )
}

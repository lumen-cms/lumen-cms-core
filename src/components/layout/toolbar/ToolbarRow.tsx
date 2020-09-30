import React from 'react'
import Container, { ContainerProps } from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import { LmComponentRender } from '../../CoreComponents'
import { LmToolbarRowProps } from './toolbarTypes'

export function LmToolbarRow({
  content,
  settings
}: LmToolbarRowProps): JSX.Element {
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
        className={'lm-system-bar'}
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
              <LmComponentRender
                content={blok}
                settings={settings}
                key={blok._uid}
              />
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
        <LmComponentRender content={blok} settings={settings} key={blok._uid} />
      ))}
    </Grid>
  )
}

import ToolbarSection from './ToolbarSection'
import * as React from 'react'
import { GlobalStoryblok, ToolbarRowStoryblok } from '../../../typings/generated/components-schema'
import clsx from 'clsx'
import Container, { ContainerProps } from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'

type ToolbarRowProps = { content: ToolbarRowStoryblok, settings: GlobalStoryblok }

function ToolbarRow({ content, settings }: ToolbarRowProps): JSX.Element {
  const body = content.body || []
  const theme = useTheme()

  if (content.is_system_bar) {
    const toolbarConfig = settings.toolbar_config || []
    let toolbarWidth: ContainerProps['maxWidth'] = false
    if (toolbarConfig.includes('fixed_width')) {
      toolbarWidth = settings.theme_container_width && settings.theme_container_width !== 'none' ? settings.theme_container_width : 'lg'
    }
    return (
      <div className={clsx('lm-system-bar')}
           style={{
             backgroundColor: (content.background_color && content.background_color.rgba) || theme.palette.primary.main
             // height: `${content.height || 40}px`
           }}>
        <Container className="h-100" maxWidth={toolbarWidth as ContainerProps['maxWidth']}>
          <Grid container className="h-100" justify={content.justify || 'space-between'} alignContent={'center'}
                alignItems={'center'}>
            {body.map(p => <ToolbarSection content={p} settings={settings} key={p._uid} />)}
          </Grid>
        </Container>
      </div>
    )
  }

  return (
    <Grid container justify={content.justify || 'space-between'} className="h-100" alignItems={'center'}>
      {body.map(p => <ToolbarSection content={p} settings={settings} key={p._uid} />)}
    </Grid>
  )
}

export default ToolbarRow

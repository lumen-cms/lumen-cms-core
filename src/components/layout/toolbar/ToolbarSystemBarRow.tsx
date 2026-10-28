import Container, { ContainerProps } from '@mui/material/Container'
import Grid from '../../../vendor/grid'
import { LmComponentRender } from '@LmComponentRender'
import React, { FC } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { Collapse } from '@mui/material'
import { useSettings } from '../../provider/SettingsPageProvider'
import { LmToolbarRowProps } from './toolbarTypes'
import Box from '@mui/material/Box'
import { Theme, useTheme } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'

const systemBarSx = (theme: Theme): SystemStyleObject<Theme> => ({
  overflow: 'hidden',
  height: `${theme.toolbar.height.systemBar || 40}px`,
  [theme.breakpoints.only('xs')]: {
    display: 'none'
  }
})

const HideOnScroll: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 500
  })
  return <Collapse in={!trigger}>{children as any}</Collapse>
}

export default function ToolbarSystemBarRow({
  content
}: LmToolbarRowProps): React.JSX.Element {
  const settings = useSettings()
  const theme = useTheme()
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
    <HideOnScroll>
      <Box
        className="lm-system-bar"
        sx={systemBarSx}
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
            justifyContent={content.justify || 'space-between'}
            alignContent="center"
            alignItems="center"
            width={'100%'}
          >
            {content.body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Grid>
        </Container>
      </Box>
    </HideOnScroll>
  )
}

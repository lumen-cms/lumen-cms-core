import { useTheme } from '@mui/material/styles'
import Container, { ContainerProps } from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { LmComponentRender } from '@LmComponentRender'
import React, { FC } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import { cx as clsx } from 'tss-react/@emotion/css'
import { Collapse } from '@mui/material'
import { useSettings } from '../../provider/SettingsPageProvider'
import { LmToolbarRowProps } from './toolbarTypes'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  root: {
    overflow: 'hidden',
    height: theme.toolbar.height.systemBar || 40,
    [theme.breakpoints.only('xs')]: {
      display: 'none'
    }
  }
}))

const HideOnScroll: FC = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 500
  })
  return <Collapse in={!trigger}>{children as any}</Collapse>
}

export default function ToolbarSystemBarRow({
  content
}: LmToolbarRowProps): JSX.Element {
  const settings = useSettings()
  const theme = useTheme()
  const { classes } = useStyles()
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
      <div
        className={clsx(classes.root, 'lm-system-bar')}
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
          >
            {content.body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Grid>
        </Container>
      </div>
    </HideOnScroll>
  )
}

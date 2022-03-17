import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import Toolbar from '@mui/material/Toolbar'
import { CreateCSSProperties } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Container, { ContainerProps } from '@mui/material/Container'
import { ContentSpace } from '../ContentSpace'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import LmScrollCollapse from './LmScrollCollapse'
import LmAppBarCollapse from './LmAppBarCollapse'
import LmTopAppContainer from './LmTopAppContainer'

const useStyles = makeStyles(() =>
  createStyles({
    toolbarCustom: (props: { settings: Partial<GlobalStoryblok> }) => {
      const options: CreateCSSProperties = {}
      const increasedFontSize = props.settings.toolbar_font_size
      if (increasedFontSize) {
        options['& .MuiButton-root'] = {
          fontSize: increasedFontSize as string // improve
        }
      }
      return options
    }
  })
)

const TopAppBar: FunctionComponent<{
  SystemBar?: React.ReactNode
}> = (props) => {
  const settings = useSettings() || {}
  const page = usePage() || {}
  const classes = useStyles({ settings })
  let toolbarWidth: ContainerProps['maxWidth'] = false
  const toolbarConfig = settings.toolbar_config || []
  const hasFeatureImage = page.property?.includes('has_feature')

  if (toolbarConfig.includes('fixed_width')) {
    toolbarWidth =
      settings.theme_container_width &&
      settings.theme_container_width !== 'none'
        ? settings.theme_container_width
        : 'lg'
  }
  return (
    <>
      <LmScrollCollapse
        isScrollCollapse={toolbarConfig.includes('scroll_collapse')}
      >
        <LmTopAppContainer>
          {props.SystemBar}
          <LmAppBarCollapse>
            <Container maxWidth={toolbarWidth as ContainerProps['maxWidth']}>
              <Toolbar
                disableGutters
                className={clsx('lm-toolbar__main', {
                  [classes.toolbarCustom]: settings.toolbar_font_size
                })}
              >
                {props.children}
              </Toolbar>
            </Container>
          </LmAppBarCollapse>
        </LmTopAppContainer>
      </LmScrollCollapse>
      {toolbarConfig.includes('fixed') && !hasFeatureImage && (
        <ContentSpace isBlock />
      )}
    </>
  )
}
TopAppBar.displayName = 'TopAppBar'

export default TopAppBar

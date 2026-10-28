import React, { FunctionComponent } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Container, { ContainerProps } from '@mui/material/Container'
import { ContentSpace } from '../ContentSpace'
import { usePage, useSettings } from '../../provider/SettingsPageProvider'
import LmScrollCollapse from './LmScrollCollapse'
import LmAppBarCollapse from './LmAppBarCollapse'
import LmTopAppContainer from './LmTopAppContainer'

const TopAppBar: FunctionComponent<
  React.PropsWithChildren<{
    SystemBar?: React.ReactNode
  }>
> = (props) => {
  const settings = useSettings() || {}
  const page = usePage() || {}
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
                className="lm-toolbar__main"
                sx={
                  settings.toolbar_font_size
                    ? {
                        '& .MuiButton-root': {
                          fontSize: settings.toolbar_font_size
                        }
                      }
                    : undefined
                }
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

import React, { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import MuiTabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useTheme } from '@mui/material/styles'
import Grid, { GridProps } from '@mui/material/Grid'
import clsx from 'clsx'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LmComponentRender } from '@LmComponentRender'
import LmIcon from '../icon/LmIcon'
import {
  HeadlineStoryblok,
  TabsItemStoryblok
} from '../../typings/generated/components-schema'
import { LmTabsProps } from './tabsTypes'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  tabContainer: {
    '& .react-swipeable-view-container > div > div': {
      padding: theme.spacing(3)
    },
    '& .MuiTab-wrapper > .MuiTypography-root': {
      textTransform: 'none',
      width: '100%'
    }
  },
  vertical: {
    '& .MuiTabs-flexContainerVertical': {
      borderRight: `1px solid ${theme.palette.divider}`
    },
    '& .react-swipeable-view-container > div > div': {
      paddingTop: 0,
      paddingBottom: 0
    }
  }
}))

const widthMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  false: false,
  auto: 'auto',
  true: true
}

export default function LmTabs({ content }: LmTabsProps): JSX.Element {
  const theme = useTheme()
  const isMobile = useMediaQuery(
    theme.breakpoints.down(content.mobile_breakpoint || 'xs')
  )

  const { classes } = useStyles()
  const [activeTab, setActiveTab] = useState(0)
  const body: TabsItemStoryblok[] = content.body || []
  const orientation =
    content.vertical_tabs && !isMobile ? 'vertical' : 'horizontal'
  const isVertical = orientation === 'vertical'
  const tabStyle = content.text_style?.[0]
  return (
    <Grid
      container
      direction="row"
      className={clsx(classes.tabContainer, {
        [classes.vertical]: isVertical
      })}
    >
      <Grid
        item
        xs={12}
        sm={
          isVertical
            ? content.tabs_width
              ? (widthMap[content.tabs_width] as GridProps['sm'])
              : 'auto'
            : 12
        }
      >
        <div>
          <MuiTabs
            aria-label="tabs"
            indicatorColor={
              content.indicator_color ? content.indicator_color : undefined
            }
            textColor={content.text_color ? content.text_color : undefined}
            value={activeTab}
            scrollButtons
            centered={!!content.centered && !isMobile}
            variant={isMobile ? 'scrollable' : content.variant || 'fullWidth'}
            orientation={orientation}
            onChange={(_, value: number) => {
              setActiveTab(value)
            }}
          >
            {body.map((tab: TabsItemStoryblok, iteration) => (
              <Tab
                label={
                  tabStyle ? (
                    <LmComponentRender
                      content={
                        {
                          ...tabStyle,
                          text: tab.title
                        } as HeadlineStoryblok
                      }
                    />
                  ) : (
                    tab.title
                  )
                }
                wrapped={!!content.wrapped}
                icon={
                  tab.icon &&
                  tab.icon.name && (
                    <LmIcon
                      style={{ fontSize: 24 }}
                      className="MuiIcon-root"
                      iconName={tab.icon.name}
                    />
                  )
                }
                aria-controls={`tabpanel-${iteration}`}
                key={tab._uid}
              />
            ))}
          </MuiTabs>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        sm={
          isVertical
            ? content.content_width
              ? (widthMap[content.content_width] as GridProps['sm'])
              : 'auto'
            : 12
        }
      >
        <div>
          <SwipeableViews
            index={activeTab}
            onChangeIndex={(i) => setActiveTab(i)}
            className="lm-slide-content"
            animateHeight={content.dynamic_height || false}
            axis="x"
          >
            {body.map((tab: TabsItemStoryblok) => (
              <div key={`content_${tab._uid}`}>
                {tab.body &&
                  tab.body.map((blok) => (
                    <LmComponentRender content={blok} key={blok._uid} />
                  ))}
              </div>
            ))}
          </SwipeableViews>
        </div>
      </Grid>
    </Grid>
  )
}

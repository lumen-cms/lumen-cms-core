import { useState } from 'react'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import Grid, { Grid2Props } from '../../vendor/grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import { LmComponentRender } from '../CoreComponents'
import LmIcon from '../icon/LmIcon'
import {
  HeadlineStoryblok,
  TabsItemStoryblok
} from '../../typings/generated/components-schema'
import { LmTabsProps } from './tabsTypes'
import LmNukaCarousel from '../slider/LmNukaCarousel'
import { useTheme } from '@mui/material/styles'

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

function TabsHeader({
  content,
  isMobile,
  orientation,
  onSelect
}: LmTabsProps & {
  isMobile: boolean
  orientation: 'vertical' | 'horizontal'
  onSelect: (value: string) => void
}) {
  const body = content.body || []
  const tabStyle = content.text_style?.[0]
  return (
    <TabList
      aria-label="Tabs"
      indicatorColor={
        content.indicator_color ? content.indicator_color : undefined
      }
      textColor={content.text_color ? content.text_color : undefined}
      scrollButtons
      centered={!!content.centered && !isMobile}
      variant={isMobile ? 'scrollable' : content.variant || 'fullWidth'}
      orientation={orientation}
      onChange={(_, value) => {
        onSelect(value)
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
          value={`${iteration}`}
          key={tab._uid}
        />
      ))}
    </TabList>
  )
}

export default function LmTabs({ content }: LmTabsProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(
    theme.breakpoints.down(content.mobile_breakpoint || 'xs')
  )

  const body: TabsItemStoryblok[] = content.body || []
  const [activeTab, setActiveTab] = useState('0')
  const orientation =
    content.vertical_tabs && !isMobile ? 'vertical' : 'horizontal'
  const isVertical = orientation === 'vertical'
  return (
    <TabContext value={activeTab}>
      <Grid
        container
        direction="row"
        sx={{
          '& .react-swipeable-view-container > div > div': {
            padding: theme.spacing(3)
          },
          '& .MuiTab-wrapper > .MuiTypography-root': {
            textTransform: 'none',
            width: '100%'
          },
          ...(isVertical && {
            '& .MuiTabs-list.MuiTabs-vertical': {
              borderRight: `1px solid ${theme.palette.divider}`
            },
            '& .react-swipeable-view-container > div > div': {
              paddingTop: 0,
              paddingBottom: 0
            }
          })
        }}
      >
        <Grid
          xs={12}
          sm={
            isVertical
              ? content.tabs_width
                ? (widthMap[content.tabs_width] as Grid2Props['sm'])
                : 'auto'
              : 12
          }
        >
          <div>
            <TabsHeader
              content={content}
              isMobile={isMobile}
              orientation={orientation}
              onSelect={setActiveTab}
            />
          </div>
        </Grid>
        <Grid
          xs={12}
          sm={
            isVertical
              ? content.content_width
                ? (widthMap[content.content_width] as Grid2Props['sm'])
                : 'auto'
              : 12
          }
        >
          <LmNukaCarousel
            withoutControls
            slideIndex={Number(activeTab)}
            beforeSlide={(_, endSlideIndex) => {
              setActiveTab(`${endSlideIndex}`)
            }}
            adaptiveHeight={!!content.dynamic_height}
          >
            {body.map((tab: TabsItemStoryblok, index) => (
              <TabPanel value={`${index}`} key={`content_${tab._uid}`}>
                {tab.body?.map((blok) => (
                  <LmComponentRender content={blok} key={blok._uid} />
                ))}
              </TabPanel>
            ))}
          </LmNukaCarousel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

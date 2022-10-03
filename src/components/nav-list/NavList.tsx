import React from 'react'
import { useStyles } from 'tss-react/mui'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import LmIcon from '../icon/LmIcon'
import { LmNavListProps } from './navListTypes'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { LmComponentRender } from '@LmComponentRender'
import { LmFlexRow } from '../flex-row/FlexRow'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'

export function LmNavList({ content }: LmNavListProps): JSX.Element {
  const { isMobile } = useDeviceDimensions()
  const { cx } = useStyles()
  const body = (content && content.body) || []
  const properties = content.properties || []
  const { header, headline_styles, navigation_item_styles } = content
  let headlineStyle = headline_styles?.[0]
  const listItemStyle = navigation_item_styles?.[0]
  const HeadlineHeader = () => (
    <LmComponentRender
      content={
        {
          _uid: headlineStyle?._uid || content._uid,
          component: 'headline',
          text: headlineStyle?.text || header,
          tag: headlineStyle?.tag || 'h5',
          typography: headlineStyle?.typography || 'headline5',
          ...headlineStyle
        } as HeadlineStoryblok
      }
    >
      {header}
    </LmComponentRender>
  )
  const isColumn = properties.some((i) => i === 'flex-column')
  const isCentered = properties.some((i) => i === 'justify-content-center')
  const ChildrenRender = () => (
    <LmFlexRow
      content={{
        _uid: content._uid,
        component: 'flex_row',
        gap: isColumn ? 0.5 : 1,
        column: isColumn,
        justify: isCentered ? 'center' : undefined,
        align_content: isCentered ? 'center' : undefined
      }}
    >
      {body.map((blok) => (
        <LmComponentRender
          content={blok}
          key={blok._uid}
          options={listItemStyle}
        />
      ))}
    </LmFlexRow>
  )
  if ((isMobile && content.collapse_on_mobile) || content.forceCollapse) {
    return (
      <Accordion>
        <AccordionSummary
          // IconButtonProps={{
          //   style: {
          //     color: 'inherit'
          //   }
          // }}
          sx={{
            color: 'inherit'
          }}
          expandIcon={
            content.collapse_icon && content.collapse_icon.name ? (
              <LmIcon iconName={content.collapse_icon.name} />
            ) : (
              <ChevronDown color={'inherit'} />
            )
          }
        >
          <HeadlineHeader />
        </AccordionSummary>
        <AccordionDetails>
          <div className={cx('lm-nav-list w-100', content.class_names?.values)}>
            <ChildrenRender />
          </div>
        </AccordionDetails>
      </Accordion>
    )
  }
  return (
    <div className={cx('lm-nav-list w-100', content.class_names?.values)}>
      {header && <HeadlineHeader />}
      <ChildrenRender />
    </div>
  )
}

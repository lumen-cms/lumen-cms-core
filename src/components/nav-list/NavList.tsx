import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import LmIcon from '../icon/LmIcon'
import { LmNavListProps } from './navListTypes'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@material-ui/core'
import { LmComponentRender } from '@LmComponentRender'
import { LmFlexRow } from '../flex-row/FlexRow'
import { HeadlineStoryblok } from '../../typings/generated/components-schema'

const useStyles = makeStyles({
  root: {
    '& .MuiTypography-root': {
      display: 'inline-block',
      paddingRight: '12px',
      '&:last-child': {
        paddingRight: '0px'
      }
    },
    '&.lm-nav-list__column .MuiTypography-root': {
      display: 'block',
      paddingRight: '0px'
    }
  }
})

export function LmNavList({ content }: LmNavListProps): JSX.Element {
  const classes = useStyles()
  const { isMobile } = useDeviceDimensions()
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
  if ((isMobile && content.collapse_on_mobile) || content.forceCollapse) {
    return (
      <Accordion>
        <AccordionSummary
          IconButtonProps={{
            style: {
              color: 'inherit'
            }
          }}
          expandIcon={
            content.collapse_icon && content.collapse_icon.name ? (
              <LmIcon iconName={content.collapse_icon.name} />
            ) : (
              <ChevronDown />
            )
          }
        >
          <HeadlineHeader />
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={clsx(
              'lm-nav-list',
              content.class_names?.values,
              {
                'lm-nav-list__column': properties.find(
                  (i) => i === 'flex-column'
                )
              },
              classes.root
            )}
          >
            <LmFlexRow
              content={{
                _uid: content._uid,
                component: 'flex_row',
                body: content.body as any
              }}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    )
  }
  const navClassNames = clsx(content.style)
  return (
    <div
      className={clsx(
        'lm-nav-list',
        content.class_names?.values,
        {
          'lm-nav-list__column': properties.find((i) => i === 'flex-column')
        },
        classes.root
      )}
    >
      {header && <HeadlineHeader />}
      <nav className={navClassNames}>
        {body.map((blok) => (
          <LmComponentRender
            content={blok}
            key={blok._uid}
            options={listItemStyle}
          />
        ))}
      </nav>
    </div>
  )
}

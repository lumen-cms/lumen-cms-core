import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import { LmCoreComponents } from '@CONFIG'
import MuiLink from '@material-ui/core/Link'
import useDeviceDimensions from '../../utils/hooks/useDeviceDimensions'
import LmIcon from '../icon/LmIcon'
import { LmNavListProps } from './navListTypes'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'

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
      display: 'block'
    }
  }
})

export function LmNavList({ content }: LmNavListProps): JSX.Element {
  const classes = useStyles()
  const { isMobile } = useDeviceDimensions()
  const body = (content && content.body) || []
  const properties = content.properties || []
  const { header } = content

  if ((isMobile && content.collapse_on_mobile) || content.forceCollapse) {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={
            content.collapse_icon && content.collapse_icon.name ? (
              <LmIcon iconName={content.collapse_icon.name} />
            ) : (
              <ChevronDown />
            )
          }
        >
          <Typography>{content.header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div
            className={clsx(
              'lm-nav-list',
              content.class_names && content.class_names.values,
              {
                'lm-nav-list__column': properties.find(
                  (i) => i === 'flex-column'
                )
              },
              classes.root
            )}
          >
            {body.map((blok) => {
              const btnProps: any = blok.link?.cached_url
                ? {
                    ...getLinkAttrs(blok.link as LinkType, {
                      openExternal: !!blok.open_external
                    }),
                    naked: true,
                    component: LmCoreComponents.lm_link_render
                  }
                : {}

              return (
                <MuiLink {...btnProps} key={blok._uid}>
                  {blok.name}
                </MuiLink>
              )
            })}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
  const navClassNames = clsx(content.style)
  return (
    <div
      className={clsx(
        'lm-nav-list',
        content.class_names && content.class_names.values,
        {
          'lm-nav-list__column': properties.find((i) => i === 'flex-column')
        },
        classes.root
      )}
    >
      {header && <h4>{header}</h4>}
      <nav className={navClassNames}>
        {body.map((blok) => {
          const btnProps: any = blok.link?.cached_url
            ? {
                ...getLinkAttrs(blok.link as LinkType, {
                  openExternal: !!blok.open_external
                }),
                naked: true,
                component: LmCoreComponents.lm_link_render
              }
            : {}
          return (
            <MuiLink {...btnProps} key={blok._uid}>
              {blok.name}
            </MuiLink>
          )
        })}
      </nav>
    </div>
  )
}

import React from 'react'
import clsx from 'clsx'
import { IconStoryblok } from '../../typings/generated/components-schema'
import { makeStyles } from '@material-ui/core/styles'
import LmIconMwc from './LmIcon'

const useStyles = makeStyles({
  icon: {
    '&.xmall': {
      fontSize: '1rem'
    },
    '&.small': {
      fontSize: '1.25rem'
    },
    '&.medium': {
      fontSize: '1.5rem'
    },
    '&.large': {
      fontSize: '2.25rem'
    },
    '&.xlarge': {
      fontSize: '2.5rem'
    },
    '&.xxlarge': {
      fontSize: '3rem'
    },
    '&.xxxlarge': {
      fontSize: '4rem'
    }
  }
})

export type LmIconProps = { content: IconStoryblok }

export function LmIcon({ content }: LmIconProps): JSX.Element {
  const classes = useStyles()
  return (
    <div className={clsx(content.class_names && content.class_names.values)}>
      <LmIconMwc
        className={clsx(classes.icon, {
          [content.size as string]: !!content.size
        })}
        iconUrl={content.icon_url}
        style={{ color: (content.color && content.color.rgba) ? content.color.rgba : undefined }}
        iconName={content.name && content.name.name}
      />
    </div>
  )
}

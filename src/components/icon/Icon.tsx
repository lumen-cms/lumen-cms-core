import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import LmIconMwc from './LmIcon'
import { LmIconProps } from './iconTypes'

const useStyles = makeStyles({
  xmall: {
    fontSize: '1rem',
    height: '1rem'
  },
  small: {
    fontSize: '1.25rem',
    height: '1.25rem'
  },
  medium: {
    fontSize: '1.5rem',
    height: '1.5rem'
  },
  large: {
    fontSize: '2.25rem',
    height: '2.25rem'
  },
  xlarge: {
    fontSize: '2.5rem',
    height: '2.5rem'
  },
  xxlarge: {
    fontSize: '3rem',
    height: '3rem'
  },
  xxxlarge: {
    fontSize: '4rem',
    height: '4rem'
  },
  icon: {
    margin: 'auto'
  }
})

export function LmIcon({ content, onClick }: LmIconProps): JSX.Element {
  const classes = useStyles()
  return (
    <div
      className={clsx(content.class_names?.values, {
        [classes[content.size || 'medium']]: true
      })}
    >
      <LmIconMwc
        onClick={() => {
          onClick && onClick()
        }}
        className={clsx(classes.icon, {
          [classes[content.size || 'medium']]: true
        })}
        iconUrl={content.icon_url}
        style={{
          color:
            content.color && content.color.rgba ? content.color.rgba : undefined
        }}
        iconName={content.name && content.name.name}
      />
    </div>
  )
}

import React from 'react'
import LmIconMwc from './LmIcon'
import { LmIconProps } from './iconTypes'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({ name: 'Icon' })({
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
  icon: {}
})

export function LmIcon({ content, onClick }: LmIconProps): JSX.Element {
  const { classes, cx: clsx } = useStyles()
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
          color: content.color?.rgba || undefined
        }}
        iconName={content.name?.name}
      />
    </div>
  )
}

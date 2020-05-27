import React from 'react'
import cx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({ palette, breakpoints }) => {
  const SIZES = {
    xs: 8,
    sm: 10,
    lg: 12
  }
  return {
    root: ({ active, color }: { active: boolean, color: 'dark' | 'light' }) => {
      const activeColor = color === 'dark' ? palette.text.primary : palette.common.white
      const inActiveColor = color === 'dark' ? palette.text.disabled : 'rgba(255,255,255,0.38)'
      return {
        display: 'inline-block',
        padding: SIZES.xs,
        lineHeight: 0,
        cursor: 'pointer',
        [breakpoints.up('sm')]: {
          padding: SIZES.sm
        },
        [breakpoints.up('lg')]: {
          padding: SIZES.lg
        },
        '& + .Indicator-root': {
          marginLeft: SIZES.xs,
          [breakpoints.up('sm')]: {
            marginLeft: SIZES.sm
          },
          [breakpoints.up('sm')]: {
            marginLeft: SIZES.lg
          }
        },
        '&:hover': {
          '&:after': {
            transform: 'scale(1.2)'
          }
        },
        '&:after': {
          content: '""',
          display: 'inline-block',
          width: SIZES.xs,
          height: SIZES.xs,
          borderRadius: '50%',
          backgroundColor: active
            ? activeColor
            : inActiveColor,
          // transition: transitions.create(),
          [breakpoints.up('sm')]: {
            width: SIZES.sm,
            height: SIZES.sm
          },
          [breakpoints.up('lg')]: {
            width: SIZES.lg,
            height: SIZES.lg
          }
        }
      }
    }
  }
})

type InvertedIndicatorProps = {
  className?: string,
  active: boolean,
  color?: 'dark' | 'light'
  onClick: any
}

function InvertedIndicator({ className, active, color, ...props }: InvertedIndicatorProps): JSX.Element {
  const classes = useStyles({ active, color: color || 'dark', ...props })
  return (
    <div
      className={cx(
        className,
        'Indicator-root',
        'InvertedIndicator-root',
        active && '-active',
        classes.root
      )}
      {...props}
    />
  )
}

export default InvertedIndicator

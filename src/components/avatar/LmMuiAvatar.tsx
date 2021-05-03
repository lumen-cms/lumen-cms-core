import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { LmMuiAvatarProps } from './avatarTypes'
import LmSquareImage from './LmSquareImage'

const useStyles = makeStyles({
  avatar: {
    backgroundColor: 'transparent',
    '&.small': {
      width: 24,
      height: 24
    },
    '&.large': {
      width: 52,
      height: 52
    },
    '&.xlarge': {
      width: 64,
      height: 64
    }
  }
})

const sizeMap = {
  xmall: 20,
  xsmall: 20,
  small: 24,
  large: 52,
  xlarge: 64
}

export function LmMuiAvatar({ src, size }: LmMuiAvatarProps): JSX.Element {
  const classes = useStyles()

  return (
    <Avatar
      className={clsx(classes.avatar, {
        [size as string]: !!size
      })}
    >
      <LmSquareImage image={src} size={size ? sizeMap[size] : 40} />
    </Avatar>
  )
}

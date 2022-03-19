import React from 'react'
import Avatar from '@mui/material/Avatar'
import clsx from 'clsx'
import { LmMuiAvatarProps } from './avatarTypes'
import LmSquareImage from './LmSquareImage'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({ name: 'Avatar' })({
  avatar: {
    backgroundColor: 'transparent',
    '&.xsmall': {
      width: 20,
      height: 20
    },
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
  xlarge: 56
}

export function LmMuiAvatar({ src, size }: LmMuiAvatarProps): JSX.Element {
  const { classes } = useStyles()

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

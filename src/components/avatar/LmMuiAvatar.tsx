import React from 'react'
import Avatar from '@mui/material/Avatar'
import { LmMuiAvatarProps } from './avatarTypes'
import LmSquareImage from './LmSquareImage'

const avatarSize = {
  xmall: 20,
  xsmall: 20,
  small: 24,
  large: 52,
  xlarge: 56
}
const sizeMap = {
  xmall: 20,
  xsmall: 20,
  small: 24,
  large: 52,
  xlarge: 56
}

export function LmMuiAvatar({ src, size }: LmMuiAvatarProps): JSX.Element {
  return (
    <Avatar
      sx={{
        bgcolor: 'transparent',
        width: avatarSize[size as string] || 24,
        height: avatarSize[size as string] || 24
      }}
    >
      <LmSquareImage image={src} size={size ? sizeMap[size] : 40} />
    </Avatar>
  )
}

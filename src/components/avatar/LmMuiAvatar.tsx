import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import Image from 'next/image'
import {
  getRootImageUrl,
  imageSizesOnWidthAndBreakpoints
} from '../../utils/imageServices'
import { LmMuiAvatarProps } from './avatarTypes'
import { storyblokImageLoader } from '../../utils/imageLoader'

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

export function LmMuiAvatar({ src, size }: LmMuiAvatarProps): JSX.Element {
  const { breakpoints } = useTheme()
  const classes = useStyles()

  return (
    <Avatar
      className={clsx(classes.avatar, {
        [size as string]: !!size
      })}
    >
      <Image
        src={src}
        layout="fill"
        objectFit="cover"
        sizes={imageSizesOnWidthAndBreakpoints(120, breakpoints)}
        {...storyblokImageLoader(src)}
      />
    </Avatar>
  )
}

import React, { CSSProperties } from 'react'
import Avatar from '@material-ui/core/Avatar'
import clsx from 'clsx'
import Image from 'next/image'
import { useTheme } from '@material-ui/core/styles'
import LmIcon from '../icon/LmIcon'
import {
  getRootImageUrl,
  imageSizesOnWidthAndBreakpoints
} from '../../utils/ImageService'
import { LmAvatarProps } from './avatarTypes'
import { getNumber } from '../../utils/numberParser'

const sizeMap = {
  dense: {
    container: 30,
    icon: 18
  },
  large: {
    container: 50,
    icon: 25
  },
  xlarge: {
    container: 64,
    icon: 32
  }
}

export function LmAvatar({ content }: LmAvatarProps): JSX.Element {
  const { breakpoints } = useTheme()

  const iconName = content.icon?.name
  const customSize = getNumber(content.custom_size) as number

  const style: CSSProperties = {
    color: content.color?.rgba || undefined,
    backgroundColor: content.image
      ? 'transparent'
      : content.background_color?.rgba || undefined
  }
  if (content.size) {
    const individualSize = sizeMap[content.size]
    if (individualSize) {
      style.width = individualSize.container
      style.height = individualSize.container
      style.fontSize = individualSize.icon
    } else {
      console.error(
        `Size of avatar is not defined inside of LmAvatar: ${content.size}`
      )
    }
  }
  if (customSize) {
    style.width = customSize
    style.height = customSize
    style.fontSize = customSize / 2
  }

  return (
    <Avatar
      variant={content.variant || 'circle'}
      style={style}
      className={clsx(content.class_names?.values)}
    >
      {content.image && (
        <Image
          src={getRootImageUrl(content.image)}
          layout="fill"
          objectFit="cover"
          sizes={imageSizesOnWidthAndBreakpoints(
            style.width ? Number(style.width) : 40,
            breakpoints
          )}
        />
      )}
      {content.letter}
      {iconName && <LmIcon iconName={iconName} />}
    </Avatar>
  )
}

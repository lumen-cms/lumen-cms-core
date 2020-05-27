import React, { CSSProperties, useEffect, useState } from 'react'
import { AvatarStoryblok } from '../../typings/generated/components-schema'
import Avatar from '@material-ui/core/Avatar'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { useInView } from 'react-intersection-observer'
import LmIcon from '../icon/LmIcon'
import { getImageAttrs } from '../../utils/ImageService'
import clsx from 'clsx'

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

export type LmAvatarProps = {
  content: AvatarStoryblok
}

export function LmAvatar({ content }: LmAvatarProps): JSX.Element {
  const [refIntersectionObserver, inView] = useInView(intersectionDefaultOptions)
  const iconName = content.icon && content.icon.name
  const imageSrc = content.image
  const customSize = content.custom_size && Number(content.custom_size)
  const [imageAttrs, setImageSrc] = useState<{ src?: string, srcSet?: string }>({})
  const style: CSSProperties = {
    color: content.color && content.color.rgba,
    backgroundColor: content.background_color && content.background_color.rgba
  }
  if (content.size) {
    const individualSize = sizeMap[content.size]
    if (individualSize) {
      style.width = individualSize.container
      style.height = individualSize.container
      style.fontSize = individualSize.icon
    } else {
      console.error(`Size of avatar is not defined inside of LmAvatar: ${content.size}`)
    }
  }
  if (customSize) {
    style.width = customSize
    style.height = customSize
    style.fontSize = customSize / 2
  }
  useEffect(
    () => {
      if (inView && imageSrc) {
        const imgAttrs = getImageAttrs({
          originalSource: imageSrc,
          width: (customSize && customSize > 128) ? customSize : 128,
          height: (customSize && customSize > 128) ? customSize : 128,
          smart: true
        })
        setImageSrc(imgAttrs)
      }
    },
    [inView, imageSrc, customSize]
  )

  return (
    <Avatar ref={refIntersectionObserver}
            variant={content.variant || 'circle'}
            style={style}
            className={clsx(content.class_names && content.class_names.values)}
            {...imageAttrs}>
      {content.letter}
      {iconName && <LmIcon iconName={iconName}></LmIcon>}
    </Avatar>
  )
}

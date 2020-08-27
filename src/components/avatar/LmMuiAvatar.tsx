import React, { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { useInView } from 'react-intersection-observer'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { getImageAttrs } from '../../utils/ImageService'
import { LmMuiAvatarProps } from './avatarTypes'

const useStyles = makeStyles({
  avatar: {
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
  const classes = useStyles()
  const [reference, inView] = useInView(intersectionDefaultOptions)
  const [imageAttrs, setImageSrc] = useState<{ src: string; srcSet: string }>({
    src: '',
    srcSet: ''
  })
  useEffect(() => {
    if (!inView) {
      return
    }
    const imgAttrs = getImageAttrs({ originalSource: src, width: 128 })
    setImageSrc(imgAttrs)
  }, [inView, src])

  return (
    <Avatar
      ref={reference}
      src={imageAttrs.src}
      srcSet={imageAttrs.srcSet}
      className={clsx(classes.avatar, {
        [size as string]: !!size
      })}
    />
  )
}

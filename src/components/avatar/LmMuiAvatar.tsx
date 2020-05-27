import * as React from 'react'
import { useEffect, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { useInView } from 'react-intersection-observer'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { getImageAttrs } from '../../utils/ImageService'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

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
    '.xlarge': {
      width: 64,
      height: 64
    }
  }
})

export type LmMuiAvatarProps = {
  src: string,
  size: 'small' | 'large' | 'xlarge' | 'xsmall' | 'xmall' | 'medium' | undefined
}

export function LmMuiAvatar({ src, size }: LmMuiAvatarProps): JSX.Element {
  const classes = useStyles()
  const [reference, inView] = useInView(intersectionDefaultOptions)
  const [imageAttrs, setImageSrc] = useState<{ src: string, srcSet: string }>({ src: '', srcSet: '' })
  useEffect(
    () => {
      if (!inView) {
        return
      }
      const imgAttrs = getImageAttrs({ originalSource: src, width: 128 })
      setImageSrc(imgAttrs)
    },
    [inView]
  )

  return (
    <Avatar ref={reference}
            src={imageAttrs.src}
            srcSet={imageAttrs.srcSet}
            className={clsx(classes.avatar, {
              [size as string]: !!size
            })} />
  )
}

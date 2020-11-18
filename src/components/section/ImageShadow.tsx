import React from 'react'

type ImageShadowProps = {
  src?: string
  srcSet?: string
  afterLoad: FunctionStringCallback
}

export default function ImageShadow({ afterLoad, ...rest }: ImageShadowProps) {
  if (!rest.src) {
    return null // don't render any component
  }
  return (
    <img
      style={{ display: 'none' }}
      alt="img shadow"
      {...rest}
      onLoad={(event) => {
        const src: string =
          event.currentTarget.currentSrc || event.currentTarget.src || ''
        if (src && typeof afterLoad === 'function') {
          afterLoad(src)
        } else {
          console.error('not found:', rest.src, src)
        }
      }}
      onError={(e) => {
        console.error(e)
      }}
    />
  )
}

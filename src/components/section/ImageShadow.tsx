import React, { useRef } from 'react'

type ImageShadowProps = {
  src?: string
  srcSet?: string
  afterLoad: FunctionStringCallback
}
export default function ImageShadow({ afterLoad, ...rest }: ImageShadowProps) {
  const ref = useRef<HTMLImageElement>(null)
  if (!rest.src) {
    return null // don't render any component
  }
  const hasLoaded = () => {
    const src: string = ref.current?.currentSrc || ref.current?.src || ''
    src && typeof afterLoad === 'function' && afterLoad(src)
  }
  return (
    <img
      ref={ref}
      style={{ display: 'none' }}
      alt="img shadow"
      {...rest}
      onLoad={hasLoaded}
    />
  )
}

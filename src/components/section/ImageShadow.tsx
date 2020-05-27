import React, { createRef, RefObject } from 'react'

type ImageShadowProps = {
  src: string,
  srcSet: string,
  afterLoad: FunctionStringCallback
}
const ImageShadow = ({ afterLoad, ...rest }: ImageShadowProps) => {
  const ref: RefObject<HTMLImageElement> = createRef()
  if (!rest.src) {
    return null // don't render any component
  }
  const hasLoaded = () => {
    const src: string = ref.current?.currentSrc || ref.current?.src || ''
    src && typeof afterLoad === 'function' && afterLoad(src)
  }
  return <img ref={ref} style={{ display: 'none' }} alt={'img shadow'} {...rest} onLoad={hasLoaded} />
}

export default ImageShadow

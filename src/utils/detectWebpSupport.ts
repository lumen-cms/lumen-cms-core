let isSupported: boolean | undefined

const supportsWebP = (): Promise<boolean | unknown> =>
  new Promise((resolve) => {
    const image = new Image()
    image.onerror = () => resolve(false)
    image.onload = () => resolve(image.width === 1)
    image.src =
      'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
  }).catch(() => Promise.resolve(false))

const hasWebpSupport = async (): Promise<boolean> => {
  if (typeof isSupported === 'boolean') {
    return isSupported
  }
  const can = await supportsWebP()
  isSupported = !!can
  return !!can
}

export default hasWebpSupport

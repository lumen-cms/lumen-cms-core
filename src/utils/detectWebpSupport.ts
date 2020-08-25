import { IncomingMessage } from 'http'

let isSupported: boolean | null | unknown = null

const supportsWebP = (): Promise<boolean | unknown> =>
  new Promise((resolve) => {
    const image = new Image()
    image.onerror = () => resolve(false)
    image.onload = () => resolve(image.width === 1)
    image.src =
      'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
  }).catch(() => Promise.resolve(false))

const hasWebpSupport = async (req?: IncomingMessage): Promise<boolean> => {
  if (req) {
    // we set this and calling it in _document to set global windows variable
    return !!(req.headers.accept && req.headers.accept.includes('webp'))
  }
  if (typeof isSupported === 'boolean') {
    return isSupported
  }
  const can = await supportsWebP()
  isSupported = can
  return !!can
}

export default hasWebpSupport

function getImage({
  src = '',
  srcSet = '',
  onReady,
  onError
}: {
  src: string
  srcSet: string
  onReady?: (s: string) => void
  onError?: (e: Event | string) => void
}) {
  let img: HTMLImageElement | null = new Image()
  img.src = src
  img.srcset = srcSet || src
  // img.crossOrigin = 'anonymous'
  img.onload = () => {
    onReady && onReady(img?.currentSrc || img?.src || '') // return current selected source
    img = null // dispose image element
  }
  img.onerror = (e) => {
    onError && onError(e)
    img = null
  }
}

export function getImagePromise({
  src,
  srcSet
}: {
  src: string
  srcSet: string
}) {
  return new Promise((resolve, reject) => {
    getImage({
      src,
      srcSet,
      onReady(s: string) {
        resolve(s)
      },
      onError(e: any) {
        reject(e)
      }
    })
  })
}

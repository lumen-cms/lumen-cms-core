export function getImagePromise({ src, srcSet }: { src: string, srcSet: string }) {
  return new Promise((resolve, reject) => {
    getImage({
      src,
      srcSet,
      onReady(src: string) {
        resolve(src)
      },
      onError(e: any) {
        reject(e)
      }
    })
  })
}

export function getImage({ src = '', srcSet = '', onReady, onError }: {
  src: string
  srcSet: string
  onReady?: Function
  onError?: Function
}) {
  let img: HTMLImageElement | null = new Image()
  img.src = src
  img.srcset = srcSet || src
  // img.crossOrigin = 'anonymous'
  img.onload = () => {
    onReady && onReady(img && (img.currentSrc || img.src)) // return current selected source
    img = null // dispose image element
  }
  img.onerror = (e) => {
    onError && onError(e)
    img = null
  }
}

import { IncomingMessage } from 'http'

const hasWebpSupport = async (req?: IncomingMessage): Promise<boolean> => {
  if (req) {
    // we set this and calling it in _document to set global windows variable
    return !!(req.headers.accept && req.headers.accept.includes('webp'))
  } else {
    const supportsWebP = function() {
      return new Promise(function(A) {
        const n = new Image
        n.onerror = function() {
          return A(!1)
        }, n.onload = function() {
          return A(1 === n.width)
        }, n.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
      }).catch(function() {
        return !1
      })
    }
    const can = await supportsWebP()
    return !!can
  }
}

export default hasWebpSupport

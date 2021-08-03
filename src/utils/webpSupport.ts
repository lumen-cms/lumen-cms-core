// import { checkWebPSupport } from 'supports-webp-sync'

let hasWebpSupport: boolean

const checkWebPSupport = () => {
  // Use canvas hack for webkit-based browsers
  // Kudos to Rui Marques: https://stackoverflow.com/a/27232658/7897049
  const e = document.createElement('canvas')
  if (
    e.toDataURL &&
    e.toDataURL('image/webp').indexOf('data:image/webp') === 0
  ) {
    return true
  }

  // Check other common browsers by version
  let m = navigator.userAgent.match(/(Edg|Firefox)\/(\d+)\./)
  if (m) {
    // @ts-ignore
    return (m[1] === 'Firefox' && m[2] >= 65) || (m[1] === 'Edge' && m[2] >= 18)
  }

  m = navigator.userAgent.match(/OS X\s?(?<os>\d+)?.+ Version\/(?<v>\d+\.\d+)/)
  if (m) {
    // @ts-ignore
    return m.groups.v >= 14 && (m.groups.os || 99) >= 11
  }

  return false
}

export const checkWebpSupport = () => {
  if (typeof hasWebpSupport !== 'undefined') {
    return hasWebpSupport
  }
  if (typeof window === 'undefined') {
    return true
  }
  hasWebpSupport = checkWebPSupport()
  return hasWebpSupport
}

import { IncomingMessage } from 'http'
import { isMobile } from 'is-mobile'

export type AppDevice = {
  device?: 'mobile' | 'tablet' | null
  isMobile: boolean
  isTablet: boolean
  width: number
  isDesktop: boolean
}

const deviceDetect = (req?: IncomingMessage): AppDevice => {
  let userAgent = req && req.headers['user-agent']
  const mobileDevice = isMobile({ ua: userAgent })
  const tabletDevice = isMobile({ ua: userAgent, tablet: true })
  const obj: AppDevice = {
    width: 1080,
    isTablet: false,
    isMobile: false,
    isDesktop: true
  }
  if (mobileDevice) {
    obj.device = 'mobile'
    obj.width = 599
    obj.isMobile = true
    obj.isDesktop = false
  } else if (tabletDevice) {
    obj.width = 959
    obj.device = 'tablet'
    obj.isTablet = true
    obj.isDesktop = false
  }
  return obj
}

export default deviceDetect

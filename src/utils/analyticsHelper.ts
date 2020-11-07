const isDev = () => process.env.NODE_ENV !== 'production'

let gaId: string | null = null
let facebookPxId: string | null = null

export const hasGtag = (): boolean => !!gaId && !isDev()
export const hasFacebookPixel = (): boolean => !!facebookPxId && !isDev()

export const analyticsOnPageChange = ({
  googleAnaliyticsId,
  url,
  facebookPixelId
}: {
  url: string
  googleAnaliyticsId?: string
  facebookPixelId?: string
}) => {
  if (!isDev()) {
    if (googleAnaliyticsId) {
      gaId = googleAnaliyticsId
      window.gtag('config', googleAnaliyticsId, {
        page_location: url,
        page_title: window.document.title
      })
    }
    if (facebookPixelId) {
      facebookPxId = facebookPixelId
      window.fbq('track', 'PageView')
    }
    window.adroll?.track('pageView')
  }
}

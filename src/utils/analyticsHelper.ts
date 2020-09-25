const isDev = () => process.env.NODE_ENV !== 'production'

let gaId: string | null = null
let facebookPxId: string | null = null

export const getGtag = (): string | null => gaId
export const hasGtag = (): boolean => !!gaId && !isDev()
export const hasFacebookPixel = (): boolean => !!facebookPxId && !isDev()
export const setGtag = (tag: string) => {
  gaId = tag
}

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
      gtag('config', googleAnaliyticsId, {
        page_location: url,
        page_title: window.document.title
      })
    }
    if (facebookPixelId) {
      facebookPxId = facebookPixelId
      fbq('track', 'PageView')
    }
  }
}

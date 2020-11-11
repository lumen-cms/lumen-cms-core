const isDev = () => process.env.NODE_ENV !== 'production'

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
      window.gtag &&
        gtag('config', googleAnaliyticsId, {
          page_location: url,
          page_title: window.document.title
        })
    }
    if (facebookPixelId) {
      window.fbq && fbq('track', 'PageView')
    }
    window.adroll?.track('pageView')
  }
}

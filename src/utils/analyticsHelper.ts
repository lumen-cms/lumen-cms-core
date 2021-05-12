const isDev = () => process.env.NODE_ENV !== 'production'

declare global {
  interface Window {
    adroll: {
      track: (k: string, opts?: any) => void
    }
    dataLayer?: {
      push: (context: any) => void
    }
  }
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
    if (process.env.NEXT_PUBLIC_GTM_CONTAINER) {
      window.dataLayer?.push({
        event: 'pageview',
        page: url
      })
    }
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

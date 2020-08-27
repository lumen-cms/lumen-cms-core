import Error from 'next/error'
import React, { useEffect } from 'react'
import NProgress from 'nprogress'
import { Router } from 'next/router'
import { AppPageProps } from '../../typings/app'
import AppSeo from '../layout/AppSeo'
import Layout from '../layout/Layout'
import { NotFound } from './404'
import { CONFIG } from '../../utils/config'
import { LmComponentRender } from '../CoreComponents'

declare global {
  interface Window {
    gtag: any
    instgrm: any
  }
}

export type LmPagesIndexProps = AppPageProps & {}

export function LmPagesIndex(props: LmPagesIndexProps): JSX.Element {
  const { settings, page, error, locale } = props
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      NProgress.done()
      const googleAnaliyticsId = CONFIG.GA || settings?.setup_google_analytics
      if (window.gtag && googleAnaliyticsId) {
        window.gtag('config', googleAnaliyticsId, {
          page_location: url,
          page_title: window.document.title
        })
      }
    }
    const handleRouteStart = () => {
      NProgress.start()
    }
    const handleRouteError = () => {
      NProgress.done()
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    Router.events.on('routeChangeStart', handleRouteStart)
    Router.events.on('routeChangeError', handleRouteError)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
      Router.events.off('routeChangeStart', handleRouteStart)
      Router.events.off('routeChangeError', handleRouteError)
    }
    /* eslint-disable-next-line */
  }, [])

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  if (error || !settings) {
    return <Error statusCode={500} />
  }
  return (
    <>
      <AppSeo
        settings={settings}
        page={page}
        previewImage={page?.preview_image}
      />
      <Layout settings={settings}>
        {page ? (
          <LmComponentRender content={page} />
        ) : (
          <NotFound locale={locale} statusCode={404} />
        )}
      </Layout>
    </>
  )
}

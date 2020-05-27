import { AppPageProps, ComponentRenderProps } from '../../typings/app'
import Error from 'next/error'
import AppSeo from '../layout/AppSeo'
import Layout from '../layout/Layout'
import React, { useEffect } from 'react'
import { NotFound } from './404'
import NProgress from 'nprogress'
import { CONFIG } from '../../utils/config'
import { Router } from 'next/router'


export type LmPagesIndexProps = AppPageProps & {
  ComponentRender: ComponentRenderProps
}

export function LmPagesIndex(props: LmPagesIndexProps): JSX.Element {
  const { settings, page, error, locale, ComponentRender } = props
  useEffect(() => {
      const handleRouteChange = (url: string) => {
        NProgress.done()
        trackGA(url)
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
    },
    []
  )

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  useEffect(
    () => {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side')
      if (jssStyles && jssStyles.parentElement) {
        jssStyles.parentElement.removeChild(jssStyles)
      }
    },
    []
  )

  function trackGA(url: string, GA?: string) {
    if (window !== undefined && window['gtag'] && (CONFIG.GA || settings?.setup_google_analytics)) {
      window['gtag']('config', CONFIG.GA || GA, {
        page_location: url,
        page_title: window.document.title
      })
    }
  }

  if (error || !settings) {
    return <Error statusCode={500} />
  }
  return (
    <>
      <AppSeo settings={settings} page={page} previewImage={page?.preview_image} />
      <Layout settings={settings}>
        {page ? (
          <ComponentRender content={page} />
        ) : (
          <NotFound locale={locale}
                    statusCode={404} />
        )}
      </Layout>
    </>
  )
}


import { NextSeo, NextSeoProps } from 'next-seo'
import React from 'react'
import { OpenGraph, OpenGraphImages, Twitter } from 'next-seo/lib/types.d'
import { NextRouter, useRouter } from 'next/router'
import { CONFIG } from '@CONFIG'
import { useAppContext } from '@context/AppContext'
import shallow from 'zustand/shallow'
import {
  ImageCoreStoryblok,
  SeoOpenGraphStoryblok,
  SeoTwitterStoryblok
} from '../../typings/generated/components-schema'
import { mapOpenGraphImage } from '../../utils/mapOpenGraphImage'
import { SeoProduct } from './seo/SeoProduct'
import { SeoSocialProfile } from './seo/SeoSocialProfile'
import { SeoLocalBusiness } from './seo/SeoLocalBusiness'
import { SeoCorporateContact } from './seo/SeoCorporateContact'
import { useAppStore } from '../../utils/state/appState'

const parseOpenGraph = (
  settingsOpenGraph: Partial<SeoOpenGraphStoryblok> = {},
  pageOpenGraph: Partial<SeoOpenGraphStoryblok> = {},
  seoMeta: NextSeoProps
): OpenGraph => {
  // set some defaults of seoMeta
  const openGraph: OpenGraph = {
    title: pageOpenGraph.title || seoMeta.title || settingsOpenGraph.title,
    description:
      pageOpenGraph.description ||
      seoMeta.description ||
      settingsOpenGraph.description,
    type: pageOpenGraph.type || settingsOpenGraph.type,
    site_name: pageOpenGraph.site_name || settingsOpenGraph.site_name,
    locale: pageOpenGraph.locale || settingsOpenGraph.locale
  }
  const images: OpenGraphImages[] = []
  // settings images
  if (settingsOpenGraph.images) {
    settingsOpenGraph.images.forEach((img: ImageCoreStoryblok) => {
      const parsed = mapOpenGraphImage(img)
      parsed && images.push(parsed)
    })
  }
  // page images
  if (pageOpenGraph.images) {
    pageOpenGraph.images.forEach((item: ImageCoreStoryblok) => {
      const parsed = mapOpenGraphImage(item)
      parsed && images.push(parsed)
    })
  }
  openGraph.images = images
  return openGraph
}

const parseTwitter = (values: SeoTwitterStoryblok): Twitter => {
  const twitter = values
  if (twitter.card_type) {
    twitter.cardType = twitter.card_type
    delete twitter.card_type // remove wrong string
  }
  return twitter
}

const getCanonicalUrl = (hostname = '', router: NextRouter) => {
  let url =
    router.locale && router.defaultLocale !== router.locale
      ? `/${router.locale}${router.asPath}`
      : router.asPath
  if (url.endsWith('home')) {
    url = url.replace('/home', '')
  } else if (url.endsWith('home/')) {
    url = url.replace('/home/', '')
  }
  return hostname + url
}

export function AppSeo(): JSX.Element {
  const { page, settings } = useAppStore(
    (state) => ({
      page: state.page,
      settings: state.settings
    }),
    shallow
  )
  const router = useRouter()
  const appCtx = useAppContext()
  const seoBody = settings.seo_body || []
  if (appCtx?.pageNotFound || !page) {
    return <NextSeo title="Not Found" noindex nofollow />
  }
  const pageSeoBody = page.seo_body || []
  const robotsIndexFollow =
    CONFIG.overwriteDisableIndex ||
    page.meta_robots ||
    !settings.seo_robots ||
    router.asPath.startsWith('/_dev_/') // todo additionally disable .now.sh domains

  const seo: NextSeoProps = {
    title:
      page.meta_title || settings.seo_title || 'Website made by Lumen Media',
    description:
      page.meta_description ||
      settings.seo_description ||
      'Website made by Lumen Media',
    noindex: robotsIndexFollow, // important to change if go live
    nofollow: robotsIndexFollow
  }

  // open graphs
  const settingsOpenGraphs: Partial<SeoOpenGraphStoryblok> = seoBody.find(
    (i) => i.component === 'seo_open_graph'
  ) as SeoOpenGraphStoryblok
  const pageOpenGraphs: Partial<SeoOpenGraphStoryblok> =
    (pageSeoBody.find(
      (i) => i.component === 'seo_open_graph'
    ) as SeoOpenGraphStoryblok) || {}
  if (page.preview_image) {
    pageOpenGraphs.images = pageOpenGraphs.images || []
    pageOpenGraphs.images.push({
      url: page.preview_image,
      alt: 'image list',
      _uid: page.preview_image,
      component: 'image_core'
    })
  }

  if (settingsOpenGraphs || pageOpenGraphs) {
    seo.openGraph = parseOpenGraph(settingsOpenGraphs, pageOpenGraphs, seo)
    const facebookAppId =
      (settingsOpenGraphs && settingsOpenGraphs.app_id) ||
      (pageOpenGraphs && pageOpenGraphs.app_id)
    facebookAppId && (seo.facebook = { appId: facebookAppId })
  }

  // twitter
  const settingsTwitter: SeoTwitterStoryblok =
    (seoBody.find(
      (i) => i.component === 'seo_twitter'
    ) as SeoTwitterStoryblok) || undefined
  if (settingsTwitter) {
    seo.twitter = parseTwitter(settingsTwitter)
  }

  if (settings.seo_website_url) {
    const canonicalUrl = getCanonicalUrl(settings.seo_website_url, router)
    seo.canonical = canonicalUrl
    if (seo.openGraph) {
      seo.openGraph.url = canonicalUrl
    }
  } else if (typeof window !== 'undefined') {
    console.warn(
      'set up seo_website_url inside of settings to have a canonical tag'
    )
  }
  return (
    <>
      <NextSeo {...seo} />
      <SeoProduct />
      <SeoSocialProfile />
      <SeoLocalBusiness />
      <SeoCorporateContact />
    </>
  )
}

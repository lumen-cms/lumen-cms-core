import { LogoJsonLd, NextSeo } from 'next-seo'
import React from 'react'
import { OpenGraph, OpenGraphImages, Twitter } from 'next-seo/lib/types.d'
import { useRouter } from 'next/router'
import {
  ImageCoreStoryblok,
  SeoOpenGraphStoryblok,
  SeoTwitterStoryblok
} from '../../typings/generated/components-schema'
import { CONFIG } from '../../utils/config'
import { AppSeoProps } from './layoutTypes'
import { mapOpenGraphImage } from '../../utils/mapOpenGraphImage'
import { SeoProduct } from './seo/SeoProduct'
import { SeoSocialProfile } from './seo/SeoSocialProfile'
import { SeoLocalBusiness } from './seo/SeoLocalBusiness'
import { SeoCorporateContact } from './seo/SeoCorporateContact'
import { imageServiceNoWebp } from '../../utils/ImageService'

type SeoMetaTypes = {
  title: string
  description: string
  noindex: boolean
  nofollow: boolean
  openGraph?: OpenGraph
  facebook?: {
    appId: string
  }
  twitter?: Twitter
  canonical?: string
}

const parseOpenGraph = (
  settingsOpenGraph: Partial<SeoOpenGraphStoryblok> = {},
  pageOpenGraph: Partial<SeoOpenGraphStoryblok> = {},
  seoMeta: SeoMetaTypes
): OpenGraph => {
  // set some defaults of seoMeta
  const openGraph: OpenGraph = {
    title: pageOpenGraph.title || seoMeta.title || settingsOpenGraph.title,
    description:
      pageOpenGraph.description ||
      seoMeta.description ||
      settingsOpenGraph.description,
    url: pageOpenGraph.url || settingsOpenGraph.url,
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

const getCanonicalUrl = (hostname = '', url: string) => {
  if (url.endsWith('home')) {
    url = url.replace('home', '')
  } else if (url.endsWith('home/')) {
    url = url.replace('home/', '')
  }
  return hostname + url
}

export function AppSeo({
  settings,
  page,
  previewImage
}: AppSeoProps): JSX.Element {
  const router = useRouter()
  const seoBody: (SeoTwitterStoryblok | SeoOpenGraphStoryblok)[] =
    settings.seo_body || []
  if (!page) {
    return <NextSeo title="Not Found" noindex />
  }
  const pageSeoBody: (SeoTwitterStoryblok | SeoOpenGraphStoryblok)[] =
    page.seo_body || []
  const robotsIndexFollow =
    CONFIG.overwriteDisableIndex || page.meta_robots || !settings.seo_robots // todo additionally disable .now.sh domains

  const seo: SeoMetaTypes = {
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
  const pageOpenGraphs: Partial<SeoOpenGraphStoryblok> = pageSeoBody.find(
    (i) => i.component === 'seo_open_graph'
  ) as SeoOpenGraphStoryblok
  if (previewImage) {
    pageOpenGraphs.images = pageOpenGraphs.images || []
    pageOpenGraphs.images.push({ url: previewImage })
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
    seo.canonical = getCanonicalUrl(settings.seo_website_url, router?.asPath)
  } else if (typeof window !== 'undefined') {
    console.warn(
      'set up seo_website_url inside of settings to have a canonical tag'
    )
  }

  return (
    <>
      <NextSeo {...seo} />
      <SeoProduct settings={settings} page={page} />
      <SeoSocialProfile settings={settings} page={page} />
      <SeoLocalBusiness settings={settings} page={page} />
      <SeoCorporateContact settings={settings} page={page} />
      {settings.website_logo && settings.seo_website_url && (
        <LogoJsonLd
          logo={imageServiceNoWebp(settings.website_logo)}
          url={settings.seo_website_url}
        />
      )}
    </>
  )
}

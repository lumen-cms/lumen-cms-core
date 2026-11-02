import 'server-only'

import type { AppPageProps } from '../typings/app'
import { Content } from './Content'
import { Providers } from './Providers'
import { Header, ChromeDrawer, ChromeExtras } from './Chrome'
import { PageFrame, FooterFrame } from './frames'

export function PublicPage({ content }: { content: AppPageProps }) {
  const { page, settings } = content
  if (!page || !settings || content.needAuth || content.insideStoryblok) {
    throw new Error(
      'App Router pilot accepts complete published public pages only'
    )
  }
  if (page.right_body?.length || page.property?.includes('enable_parallax')) {
    throw new Error(
      'App Router pilot does not yet support right drawers or parallax'
    )
  }
  // Keep browser-visible configuration but remove content that is composed on
  // the server. No complete page or footer document crosses this boundary.
  const pageConfig = {
    _uid: page._uid,
    component: page.component,
    uuid: page.uuid,
    property: page.property,
    mobile_breakpoint: page.mobile_breakpoint,
    right_drawer_width: page.right_drawer_width
  }
  const {
    footer: _footer,
    promotion: _promotion,
    scripts: _scripts,
    custom_css: _css,
    setup_favicon: _favicon,
    seo_body: _seoBody,
    seo_title: _seoTitle,
    seo_description: _seoDescription,
    seo_website_url: _seoUrl,
    setup_google_site_verification: _verification,
    ...settingsConfig
  } = settings
  return (
    <Providers
      content={{ ...content, page: pageConfig, settings: settingsConfig }}
    >
      <Header />
      <PageFrame
        mobileNavBreakpoint={settings.mobile_nav_breakpoint}
        mobileBreakpoint={page.mobile_breakpoint}
        promotion={
          !page.property?.includes('has_feature') &&
          !page.property?.includes('disable_promotion')
            ? settings.promotion?.map((blok) => (
                <Content key={blok._uid} content={blok} />
              ))
            : null
        }
      >
        {page.body?.map((blok, index) => (
          <Content key={blok._uid} content={blok} sectionPosition={index} />
        ))}
      </PageFrame>
      <ChromeDrawer />
      <FooterFrame>
        {settings.footer?.map((blok) => (
          <Content key={blok._uid} content={blok} />
        ))}
      </FooterFrame>
      <ChromeExtras />
    </Providers>
  )
}

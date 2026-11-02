import type {
  PageStoryblok,
  SectionStoryblok
} from '../../typings/generated/components-schema'
import { LmCoreComponents } from '../../utils/config'
import { PageRightDrawer } from './PageRightDrawer'
import { PageFrame, PageBody, type PageFrameProps } from './PageFrame'
import type { ReactNode } from 'react'
import { LmComponentRender } from '../CoreComponents'

function sectionForContent(
  page: PageStoryblok | NonNullable<SectionStoryblok['body']>[number]
): SectionStoryblok {
  return {
    component: 'section',
    _uid: page._uid,
    body: page.component === 'page' ? [] : [page]
  }
}

export type PageContentProps = {
  content: PageStoryblok
  mobileNavBreakpoint?: PageFrameProps['mobileNavBreakpoint']
  promotion?: ReactNode
  rightDrawerHeader?: ReactNode
}

export function PageContent({
  content,
  mobileNavBreakpoint,
  promotion,
  rightDrawerHeader
}: PageContentProps): React.JSX.Element {
  const body = content.body || []
  const rightBody = content.right_body || []
  if (content.component !== 'page') {
    return <LmComponentRender content={sectionForContent(content)} />
  }
  if (!body.length) {
    return (
      <>
        {promotion}
        <div style={{ padding: 20, textAlign: 'center' }}>
          There is no content yet...
        </div>
      </>
    )
  }
  const children = (
    <>
      {rightBody.length > 0 && (
        <PageRightDrawer
          rightBody={rightBody}
          headerSpace={rightDrawerHeader}
          mobileBreakpoint={content.mobile_breakpoint}
        />
      )}
      <PageFrame
        hasRightDrawer={rightBody.length > 0}
        mobileBreakpoint={content.mobile_breakpoint}
        mobileNavBreakpoint={mobileNavBreakpoint}
        promotion={
          !content.property?.includes('has_feature') &&
          !content.property?.includes('disable_promotion')
            ? promotion
            : null
        }
      >
        <PageBody body={body} />
      </PageFrame>
    </>
  )
  if (
    content.property?.includes('enable_parallax') ||
    body.some((i) => i.component === 'section_parallax')
  ) {
    const ParallaxProvider = LmCoreComponents.parallax_provider!
    return <ParallaxProvider>{children}</ParallaxProvider>
  }
  return children
}

import React from 'react'
import dynamic from 'next/dynamic'
import RightDrawer from './RightDrawer'
import { MainContent } from './MainContent'
import { LmPageProps } from './pageTypes'

const ParallaxProviderDynamic = dynamic(
  () =>
    import(
      /* webpackChunkName: 'parallax' */ '../section/parallaxHelpers/ParallaxProviderDefaultExport'
    )
)

export function LmPage({ content }: LmPageProps): JSX.Element {
  const body = content.body || []
  const rightBody = content.right_body || []

  if (!body.length) {
    return <div>There is no content yet...</div>
  }

  if (!body.some((i) => i.component === 'section_parallax')) {
    return (
      <>
        {rightBody.length > 0 && <RightDrawer rightBody={rightBody} />}
        <MainContent body={body} />
      </>
    )
  }
  return (
    <ParallaxProviderDynamic>
      {rightBody.length > 0 && <RightDrawer rightBody={rightBody} />}
      <MainContent body={body} />
    </ParallaxProviderDynamic>
  )
}

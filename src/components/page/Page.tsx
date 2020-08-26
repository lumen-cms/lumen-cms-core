import { ParallaxProvider } from 'react-scroll-parallax'
import React from 'react'
import RightDrawer from './RightDrawer'
import { MainContent } from './MainContent'
import { LmPageProps } from './pageTypes'

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
    <ParallaxProvider>
      {rightBody.length > 0 && <RightDrawer rightBody={rightBody} />}
      <MainContent body={body} />
    </ParallaxProvider>
  )
}

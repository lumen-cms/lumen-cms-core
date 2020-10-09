import React from 'react'
import { LmCoreComponents } from '@CONFIG'
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line react/jsx-pascal-case
    <LmCoreComponents.parallax_provider>
      {rightBody.length > 0 && <RightDrawer rightBody={rightBody} />}
      <MainContent body={body} />
    </LmCoreComponents.parallax_provider>
  )
}

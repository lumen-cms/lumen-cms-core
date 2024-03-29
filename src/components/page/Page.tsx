import React from 'react'
import { LmCoreComponents } from '@CONFIG'
import RightDrawer from './RightDrawer'
import { MainContent } from './MainContent'
import { LmPageProps } from './pageTypes'
import { usePage } from '../provider/SettingsPageProvider'
import EmptyContent from './EmptyContent'
import { LmComponentRender } from '@LmComponentRender'

export function LmPage({ content }: LmPageProps): JSX.Element {
  const page = usePage()

  const currentContent = page || content
  const body = currentContent?.body || []
  const rightBody = currentContent?.right_body || []
  if (page.component !== 'page') {
    return (
      <LmComponentRender
        content={{ component: 'section', _uid: page._uid, body: [page] }}
      />
    )
  }
  if (!body.length) {
    return <EmptyContent />
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
    // eslint-disable-next-line
    // @ts-ignore
    // eslint-disable-next-line react/jsx-pascal-case
    <LmCoreComponents.parallax_provider>
      {rightBody.length > 0 && <RightDrawer rightBody={rightBody} />}
      <MainContent body={body} />
    </LmCoreComponents.parallax_provider>
  )
}

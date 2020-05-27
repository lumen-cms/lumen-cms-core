import * as React from 'react'
import { LinkStoryblok } from '../../typings/generated/components-schema'
import ContentLink from './ContentLink'
import { useAppContext } from '../provider/AppProvider'

export type LmLinkProps = { content: LinkStoryblok }

export function LmLink({ content }: LmLinkProps): JSX.Element {
  const { ComponentRender } = useAppContext()

  return (
    <ContentLink className={'lm-wrap-content__link'} content={content}>
      {(content.body || []).map((blok, i) => ComponentRender({ content: blok, i }))}
    </ContentLink>
  )
}


import React from 'react'
import { NavItemStoryblok } from '../../typings/generated/components-schema'
import ContentLink from '../link/ContentLink'


export type LmNavListItemProps = NavItemStoryblok

export function LmNavListItem(props: LmNavListItemProps): JSX.Element {
  const content = { ...props }

  return (
    <ContentLink isMuiLink={true} className={'lm-nav-link__item'} content={content}>
      {content.name}
    </ContentLink>
  )
}


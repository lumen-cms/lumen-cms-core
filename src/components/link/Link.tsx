import React from 'react'
import MuiLink from '@material-ui/core/Link'
import clsx from 'clsx'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmComponentRender } from '../CoreComponents'
import { LmLinkProps } from './linkTypes'

export function LmLink({ content }: LmLinkProps): JSX.Element {
  const { LinkRender } = useAppContext()
  if (!content.link?.cached_url) {
    return (
      <span className={clsx(content.class_names?.values)}>
        {(content.body || []).map((blok) => (
          <LmComponentRender content={blok} key={blok._uid} />
        ))}
      </span>
    )
  }
  const btnProps: any = {
    ...getLinkAttrs(content.link as LinkType, {
      openExternal: !!content.open_external
    }),
    naked: true,
    component: LinkRender
  }
  return (
    <MuiLink
      {...btnProps}
      className={clsx('lm-link__container', content.class_names?.values)}
    >
      {(content.body || []).map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </MuiLink>
  )
}

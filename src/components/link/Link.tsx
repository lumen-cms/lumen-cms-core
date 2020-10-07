import React from 'react'
import MuiLink from '@material-ui/core/Link'
import clsx from 'clsx'
import { LmComponentRender } from '@LmComponentRender'
import { LmCoreComponents } from '@CONFIG'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmLinkProps } from './linkTypes'

export function LmLink({ content }: LmLinkProps): JSX.Element {
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
    component: LmCoreComponents.lm_link_render
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

import React from 'react'
import MuiLink from '@material-ui/core/Link'
import clsx from 'clsx'
import { LinkStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmComponentRender } from '../CoreComponents'

export type LmLinkProps = { content: LinkStoryblok }

export function LmLink({ content }: LmLinkProps): JSX.Element {
  const { LinkRender } = useAppContext()
  if (!content.link?.cached_url) {
    return (
      <span className={clsx(content.class_names?.values)}>
        {(content.body || []).map((blok, i) =>
          LmComponentRender({ content: blok, i })
        )}
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
      {(content.body || []).map((blok, i) =>
        LmComponentRender({ content: blok, i })
      )}
    </MuiLink>
  )
}

import { default as React, FunctionComponent } from 'react'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import Link, { LinkProps } from 'next/link'
import MuiNextLink from './MuiNextLink'
import {
  ButtonStoryblok,
  CardListItemStoryblok,
  ImageListItemStoryblok,
  LinkStoryblok,
  NavItemStoryblok,
  TimelineItemStoryblok
} from '../../typings/generated/components-schema'
import { CONFIG } from '../../utils/config'

const ContentLink: FunctionComponent<{
  className: string
  content: ButtonStoryblok | CardListItemStoryblok | LinkStoryblok | NavItemStoryblok | TimelineItemStoryblok | ImageListItemStoryblok
  passHref?: boolean
  isMuiLink?: boolean
}> = ({ children, className, content, passHref, isMuiLink }) => {
  if (content.link) {
    const { rel, target, external, ...attrs } = getLinkAttrs(content.link as LinkType, { openExternal: !!content.open_external })

    if (attrs.href) {
      if (external) {
        return isMuiLink ? (
          <MuiNextLink href={attrs.href as string} rel={rel} target={target} className={className}>
            {children}
          </MuiNextLink>
        ) : (
          <a href={attrs.href as string} rel={rel} target={target} className={className}>{children}</a>
        )
      }
      const props: Partial<LinkProps> = {}
      if (!CONFIG.prefetch) {
        props.prefetch = false
      }
      if (isMuiLink) {
        return (
          <MuiNextLink href={content.link.nextHref || CONFIG.href} as={attrs.href} {...props}>
            {children}
          </MuiNextLink>
        )
      }
      if (!passHref) {
        return <Link {...attrs} href={content.link.nextHref || CONFIG.href} as={attrs.href} {...props}>
          <a rel={rel} target={target} className={className}>{children}</a>
        </Link>
      }
      return <Link {...attrs} href={content.link.nextHref || CONFIG.href} as={attrs.href} passHref {...props}>
        {children}
      </Link>
    }
  }
  return <>{children}</>
}
ContentLink.displayName = 'ContentLink'

export default ContentLink

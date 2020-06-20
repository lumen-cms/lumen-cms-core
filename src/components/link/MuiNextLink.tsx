import React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link'
import { CONFIG } from '../../utils/config'

// https://github.com/mui-org/material-ui/blob/4b6cbf0/examples/nextjs-with-typescript/src/Link.tsx
type NextComposedProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  NextLinkProps & {
  external?: boolean
  nextHref?: string
}

const NextComposed = React.forwardRef<HTMLAnchorElement, NextComposedProps>(({ as, href, replace, scroll, passHref, shallow, prefetch, ...other }, ref) => {
  if (other.external) {
    delete other.nextHref
    delete other.external
    return <a ref={ref} {...other} href={href as string} />
  } else if (!as && href) {
    as = href
    href = other.nextHref || CONFIG.href
    delete other.nextHref
    delete other.external
  }
  return (
    <NextLink
      href={href}
      prefetch={prefetch}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
    >
      <a ref={ref} {...other} />
    </NextLink>
  )
})
NextComposed.displayName = 'NextComposedLink'

interface LinkPropsBase {
  activeClassName?: string;
  innerRef?: React.Ref<HTMLAnchorElement>;
  naked?: boolean;
}

export type LinkProps = LinkPropsBase & NextComposedProps & Omit<MuiLinkProps, 'href'>;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link(props: LinkProps): JSX.Element {
  const {
    href,
    activeClassName = 'active',
    className: classNameProps,
    innerRef,
    naked,
    ...other
  } = props

  const router = useRouter()
  const pathname = typeof href === 'object' ? href.pathname : href
  const className = clsx(classNameProps, {
    [activeClassName]: router?.pathname === pathname && activeClassName // todo probably router.asPath??
  })

  if (naked) {
    return <NextComposed className={className} ref={innerRef} href={href} {...other} />
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href as string}
      {...other}
    />
  )
}

const MuiNextLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link {...props} innerRef={ref} />
))
MuiNextLink.displayName = 'MuiNextLink'

export default MuiNextLink

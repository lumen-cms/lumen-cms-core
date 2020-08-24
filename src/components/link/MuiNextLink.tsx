import React from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link'
import { CONFIG } from '../../utils/config'

// https://github.com/mui-org/material-ui/blob/4b6cbf0/examples/nextjs-with-typescript/src/Link.tsx
type NextComposedProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> &
  Omit<NextLinkProps, 'href'> & {
    href: string
    external?: boolean
    nextHref?: string
  }

const NextComposed = React.forwardRef<HTMLAnchorElement, NextComposedProps>(
  (
    { as, href, replace, scroll, passHref, shallow, prefetch, ...other },
    ref
  ) => {
    if (other.external) {
      delete other.nextHref
      delete other.external
      return <a ref={ref} {...other} href={href} />
    }
    if (!as && href) {
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
  }
)
NextComposed.displayName = 'NextComposedLink'

interface LinkPropsBase {
  activeClassName?: string
  innerRef?: React.Ref<HTMLAnchorElement>
  naked?: boolean
}

export type LinkProps = LinkPropsBase &
  Omit<NextComposedProps, 'href'> &
  Omit<MuiLinkProps, 'href'> & {
    href?: string
  }

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

  const pathname = href
  const className = clsx(classNameProps, {
    [activeClassName]: router?.pathname === pathname && activeClassName, // todo probably router.asPath??
  })
  if (!href) {
    console.log(props)
    return <a {...other} className={className} />
  }
  if (naked) {
    return (
      <NextComposed
        className={className}
        ref={innerRef}
        href={href}
        {...other}
      />
    )
  }

  return (
    <MuiLink
      component={NextComposed}
      className={className}
      ref={innerRef}
      href={href}
      {...other}
    />
  )
}

const MuiNextLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => <Link {...props} innerRef={ref} />
)
MuiNextLink.displayName = 'MuiNextLink'

export default MuiNextLink

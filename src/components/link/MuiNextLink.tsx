import React from 'react'
import NextLink from 'next/link'
import MuiLink from '@material-ui/core/Link'
import { useRouter } from 'next/router'
import { LinkProps, NextComposedProps } from './linkTypes'

const NextComposed = React.forwardRef<HTMLAnchorElement, NextComposedProps>(
  ({ href, replace, scroll, passHref, shallow, prefetch, ...other }, ref) => {
    const { defaultLocale, locales, locale } = useRouter()
    if (other.external) {
      delete other.external
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a ref={ref} {...other} href={href} />
    }
    const detectedLocale =
      locales?.find((l) => l === href.split('/')[1]) || defaultLocale

    return (
      <NextLink
        href={href}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        locale={detectedLocale !== locale ? false : undefined}
      >
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <a ref={ref} {...other} />
      </NextLink>
    )
  }
)
NextComposed.displayName = 'NextComposedLink'

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/#with-link
function Link({
  href,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  activeClassName = 'active',
  className: classNameProps,
  innerRef,
  naked,
  ...other
}: LinkProps): JSX.Element {
  //
  // const className = clsx(classNameProps, {
  //   [activeClassName]: router?.asPath === href && activeClassName
  // })
  const className = classNameProps
  if (!href) {
    // console.log(props)
    // eslint-disable-next-line jsx-a11y/anchor-has-content
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

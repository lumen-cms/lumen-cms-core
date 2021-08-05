import React, { AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import MuiLink from '@material-ui/core/Link'
import { useRouter } from 'next/router'
import { CONFIG } from '@CONFIG'
import clsx from 'clsx'
import { LinkProps, NextComposedProps } from './linkTypes'

const base64encode =
  typeof btoa !== 'undefined'
    ? btoa
    : (b: string) => Buffer.from(b).toString('base64')

const NextComposed = React.forwardRef<HTMLAnchorElement, NextComposedProps>(
  ({ href, replace, scroll, passHref, shallow, prefetch, ...other }, ref) => {
    const { defaultLocale, locales, locale } = useRouter() || {}
    if (other.external) {
      delete other.external
      const currentLinkProps =
        href.startsWith('mailto:') || href.startsWith('tel:')
          ? ({
              href: '/#',
              'data-href': base64encode(href),
              onClick: (event) => {
                event.preventDefault()
                window.location.href = atob(
                  event.currentTarget.getAttribute('data-href') as string
                )
              }
            } as AnchorHTMLAttributes<HTMLAnchorElement>)
          : {
              href: href as string
            }

      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a ref={ref} {...other} {...currentLinkProps} />
    }
    const detectedLocale =
      locales?.find((l) => l === href.split('/')[1]) || defaultLocale

    return (
      <NextLink
        href={
          CONFIG.enableLocaleSuffix ? href.replace(`/${locale}/`, '/') : href
        }
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

// eslint-disable-next-line
// @ts-ignore
const MuiNextLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const {
      href,
      activeClassName = 'lm_active',
      className: classNameProps,
      naked,
      ...other
    } = props
    const { asPath } = useRouter() || {}
    const className = clsx(classNameProps, {
      [activeClassName]: asPath === href && activeClassName
    })
    // const className = classNameProps
    if (!href) {
      // console.log(props)
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      return <a {...other} className={className} />
    }

    if (naked) {
      return (
        <NextComposed className={className} ref={ref} href={href} {...other} />
      )
    }

    return (
      <MuiLink
        component={NextComposed}
        className={className}
        ref={ref}
        href={href}
        {...other}
      />
    )
  }
)
MuiNextLink.displayName = 'MuiNextLink'

export default MuiNextLink

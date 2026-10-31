import {
  AnchorHTMLAttributes,
  forwardRef,
  useCallback,
  type SyntheticEvent
} from 'react'
import NextLink from 'next/link'
import MuiLink from '@mui/material/Link'
import { CONFIG } from '../../utils/config'
import { LinkProps, NextComposedProps } from './linkTypes'
import { useAppContext } from '../provider/context/AppContext'
import clsx from 'clsx'
import { scrollToLinkAnchor } from './scrollToLinkAnchor'

const NextLinkComposed = forwardRef<HTMLAnchorElement, NextComposedProps>(
  function NextLinkComposedFunc(
    { href, replace, scroll, passHref, shallow, prefetch, ...other },
    ref
  ) {
    const { defaultLocale, locales, locale } = useAppContext()

    // enable smooth scroll
    const handleClick = useCallback(
      (e: SyntheticEvent<HTMLAnchorElement>) => {
        void scrollToLinkAnchor(href, e)
      },
      [href]
    )
    if (other.external) {
      delete other.external
      const currentLinkProps =
        href.startsWith('mailto:') || href.startsWith('tel:')
          ? ({
              href: '/#',
              'data-href': btoa(href),
              onClick: (event) => {
                event.preventDefault()
                window.location.href = atob(
                  event.currentTarget.getAttribute('data-href') as string
                )
              }
            } as AnchorHTMLAttributes<HTMLAnchorElement>)
          : {
              href: href
            }

      return <a ref={ref} {...other} {...currentLinkProps} />
    }
    const detectedLocale =
      locales?.find((l) => l === href.split('/')[1]) || defaultLocale
    delete other.external

    // to improve scroll to anchor check this: https://github.com/vercel/next.js/issues/5136#issuecomment-900144671
    let currentHref = CONFIG.enableLocaleSuffix
      ? href.replace(`/${locale}/`, '/')
      : href
    if (CONFIG.redirects && CONFIG.redirects.has(currentHref)) {
      currentHref = CONFIG.redirects.get(currentHref) as string
    }
    return (
      <NextLink
        ref={ref}
        {...other}
        href={currentHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={detectedLocale !== locale ? false : undefined}
        onClick={handleClick}
        onKeyDown={handleClick}
      />
    )
  }
)
NextLinkComposed.displayName = 'NextLinkComposed'

const MuiNextLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function MuiNextLinkFunc(props, ref) {
    const {
      href,
      activeClassName = 'lm_active',
      className: classNameProps,
      naked,
      ...other
    } = props
    const { slug } = useAppContext()
    const className = clsx(classNameProps, {
      [activeClassName]: !!(slug === href && activeClassName)
    })
    // const className = classNameProps
    if (!href) {
      // console.log(props)
      return <a {...other} className={className} />
    }

    if (naked) {
      return (
        <NextLinkComposed
          className={className}
          ref={ref}
          href={href}
          {...other}
        />
      )
    }

    return (
      <MuiLink
        component={NextLinkComposed}
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

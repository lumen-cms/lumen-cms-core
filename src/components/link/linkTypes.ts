import React from 'react'
import { LinkProps as MuiLinkProps } from '@mui/material'
import { LinkProps as NextLinkProps } from 'next/link'
import { LinkStoryblok } from '../../typings/generated/components-schema'

export type LmLinkProps = { content: LinkStoryblok }
// https://github.com/mui-org/material-ui/blob/4b6cbf0/examples/nextjs-with-typescript/src/Link.tsx
export type NextComposedProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> &
  Omit<NextLinkProps, 'href'> & {
    href: string
    external?: boolean
  }

export type LinkProps = Omit<NextComposedProps, 'href'> &
  Omit<MuiLinkProps, 'href'> & {
    href?: string
  } & {
    activeClassName?: string
    innerRef?: React.Ref<HTMLAnchorElement>
    naked?: boolean
  }

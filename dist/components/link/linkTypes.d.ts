import React from 'react';
import { LinkProps as MuiLinkProps } from '@material-ui/core';
import { LinkProps as NextLinkProps } from 'next/link';
import { LinkStoryblok } from '../../typings/generated/components-schema';
export declare type LmLinkProps = {
    content: LinkStoryblok;
};
export declare type NextComposedProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & Omit<NextLinkProps, 'href'> & {
    href: string;
    external?: boolean;
    nextHref?: string;
};
interface LinkPropsBase {
    activeClassName?: string;
    innerRef?: React.Ref<HTMLAnchorElement>;
    naked?: boolean;
}
export declare type LinkProps = LinkPropsBase & Omit<NextComposedProps, 'href'> & Omit<MuiLinkProps, 'href'> & {
    href?: string;
};
export {};

import { render } from 'storyblok-rich-text-react-renderer-ts'
import { getLinkAttrs } from '../../utils/linkHandler'
import { LmCoreComponents } from '@CONFIG'
import MuiLink from '@mui/material/Link'

export const renderRichText = (body: any) =>
  render(body, {
    markResolvers: {
      link: function RichtTextLink(children, props) {
        const { href, linktype, target } = props
        const btnProps: any = {
          ...getLinkAttrs(
            {
              cached_url: href,
              linktype
            },
            {
              openExternal: target === '_blank'
            }
          ),
          naked: true,
          component: LmCoreComponents.lm_link_render
        }
        return <MuiLink {...btnProps}>{children}</MuiLink>
      }
    }
  })

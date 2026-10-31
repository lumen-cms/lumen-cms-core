import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { LmCoreComponents } from '../../../utils/config'
import {
  ButtonStoryblok,
  NavMenuItemStoryblok,
  NavItemStoryblok,
  NavMenuStoryblok
} from '../../../typings/generated/components-schema'
import LmIcon from '../../icon/LmIcon'
import { getLinkAttrs, LinkType } from '../../../utils/linkHandler'
import { useAppContext } from '../../provider/context/AppContext'

type DrawerButtonProps = {
  content:
    | ButtonStoryblok
    | NavMenuItemStoryblok
    | NavItemStoryblok
    | NavMenuStoryblok
}

export function DrawerButton({
  content
}: DrawerButtonProps): React.JSX.Element {
  const { slug } = useAppContext()
  // Legacy navigation blocks share these optional presentation fields.
  const fields = content as Pick<
    ButtonStoryblok,
    'label' | 'name' | 'icon' | 'link' | 'open_external'
  >
  const buttonProps = {
    text: fields.label || fields.name,
    graphic: fields.icon?.name
  }
  const cachedUrl = fields.link?.cached_url
  const btnProps: any = cachedUrl
    ? {
        ...getLinkAttrs(fields.link as LinkType, {
          openExternal: !!fields.open_external
        }),
        activeClassName: 'Mui-selected',
        // naked: true,
        component: LmCoreComponents.lm_link_render
      }
    : {}

  const isActiveRoute = cachedUrl
    ? (slug?.includes(`/${cachedUrl}`) ?? false)
    : false

  return (
    <ListItemButton {...btnProps} selected={isActiveRoute}>
      {buttonProps.graphic && (
        <ListItemIcon>
          <LmIcon
            iconName={buttonProps.graphic}
            style={{
              width: '1.5rem',
              height: '1.5rem'
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText primary={buttonProps.text} />
    </ListItemButton>
  )
}

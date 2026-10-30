import type {
  FlexRowStoryblok,
  IconStoryblok
} from '../../../typings/generated/components-schema'
import type { Travel } from '../../typings/generated/hasura-schema'

export type TravelSectionProps = { content: Travel; langKey: 'DE' | 'EN' }

export const mainFlexRowHeadline = ({
  icon,
  text
}: {
  icon: string
  text: string
}) =>
  ({
    _uid: icon,
    component: 'flex_row',
    gap: 1,
    styles: [{ margin: '40px 0 0 0' }],
    body: [
      {
        component: 'icon',
        _uid: 'icon-' + icon,
        class_names: { values: ['text-primary'] },
        name: { name: icon }
      } as IconStoryblok,
      {
        _uid: 'head-' + icon,
        component: 'headline',
        typography: 'headline5',
        font: 'alt1',
        class_names: { values: ['font-weight-800'] },
        text: text
      }
    ]
  } as FlexRowStoryblok)

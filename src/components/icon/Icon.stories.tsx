import { LmIcon } from './Icon'
import { IconStoryblok } from '../../typings/generated/components-schema'

export default {
  title: 'Design/Data Display/Icons'
}

const icon = {
  _uid: '13123',
  component: 'icon',
  name: {
    name: 'home'
  }
} as IconStoryblok

export const Playground = () => (
  <>
    <LmIcon content={{ ...icon, size: 'xmall' }} />
    <LmIcon content={{ ...icon, size: 'small' }} />
    <LmIcon content={{ ...icon, size: 'medium' }} />
    <LmIcon content={{ ...icon }} />
    <LmIcon content={{ ...icon, size: 'large' }} />
    <LmIcon
      content={{
        ...icon,
        size: 'large',
        class_names: {
          values: ['text-primary']
        }
      }}
    />
    <LmIcon
      content={{
        ...icon,
        size: 'xlarge',
        class_names: {
          values: ['text-danger']
        }
      }}
    />
    <LmIcon
      content={{
        ...icon,
        size: 'xxlarge',
        class_names: {
          values: ['text-danger']
        }
      }}
    />
    <LmIcon
      content={{
        ...icon,
        size: 'xxxlarge',
        class_names: {
          values: ['text-danger']
        }
      }}
    />
    <LmIcon
      content={{
        ...icon,
        icon_url:
          'https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/airbnb.svg',
        size: 'xxxlarge'
      }}
    />
  </>
)

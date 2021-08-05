import { LmComponentRender as LmIframe } from '@LmComponentRender'
import {
  IframeAdvancedStoryblok,
  IframeStoryblok
} from '../../typings/generated/components-schema'
import { storyIframe } from '../../storybook/core/various'

const props: IframeStoryblok = {
  _uid: '2313',
  component: 'iframe',
  url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
}

const advanced: IframeAdvancedStoryblok = {
  _uid: '1231',
  component: 'iframe_advanced',
  url: 'https://mysga.studentsgoabroad.com/?id=cj9sfuvq9onal0116182ztkb0'
}

const advanced2: IframeAdvancedStoryblok = {
  _uid: '1231332',
  component: 'iframe_advanced',
  url: 'https://mysga.studentsgoabroad.com/?id=cj9sl3csjyn7z0160hnehn855&fluid'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Design/Data Display/IFrame'
}

export const Basic = () => (
  <>
    <LmIframe content={props} />
  </>
)
export const Responsive = () => (
  <>
    <h3>16 by 9</h3>
    <LmIframe content={{ ...props, responsive_ratio: '16by9' }} />
    <h3>4 by 3</h3>
    <LmIframe content={{ ...props, responsive_ratio: '4by3' }} />
  </>
)
export const Advanced = () => <LmIframe content={advanced} />
export const WithMessage = () => <LmIframe content={advanced2} />
export const Playground = () => (
  <>
    <LmIframe
      content={storyIframe({
        options: {
          responsive_ratio: '16by9',
          url: 'https://www.youtube.com/embed/tgbNymZ7vqY'
        }
      })}
    />
  </>
)

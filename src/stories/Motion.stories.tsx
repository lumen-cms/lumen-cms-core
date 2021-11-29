import { LmComponentRender as LmMotion } from '@LmComponentRender'
import { HeadlineStoryblok } from '../typings/generated/components-schema'
import { storyMotion } from '../storybook/core/various'

// eslint-disable-next-line import/no-anonymous-default-export
export default { title: 'Design/Utils/Transitions' }

const body = [
  {
    _uid: '21312',
    component: 'headline',
    typography: 'headline4',
    text: 'This is a Headline4'
  },
  {
    _uid: '2eqew',
    component: 'headline',
    typography: 'headline3',
    text: 'Some subtitle text headline3'
  }
] as HeadlineStoryblok[]

export const Overview = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ maxWidth: '60vw' }}>
      <h2>Scroll down to see animations in action</h2>
      <h3>Slide:</h3>
      <LmMotion
        content={{
          _uid: '1231',
          component: 'motion',
          type: 'slide',
          duration: 1000,
          body
        }}
      />

      <h3>Collapse:</h3>
      <LmMotion
        content={{
          _uid: '21312',
          type: 'collapse',
          component: 'motion',
          duration: 5000,
          body
        }}
      />
      <h3>Fade:</h3>
      <LmMotion
        content={{
          _uid: '21312',
          type: 'fade',
          component: 'motion',
          duration: 5000,
          body
        }}
      />
      <h3>Grow:</h3>
      <LmMotion
        content={{
          _uid: 'aw3',
          type: 'grow',
          component: 'motion',
          duration: 5000,
          body
        }}
      />
      <h3>Zoom:</h3>
      <LmMotion
        content={{
          _uid: 'adsfa',
          type: 'zoom',
          component: 'motion',
          duration: 5000,
          body
        }}
      />
      <h3>End of presentation of motion</h3>
    </div>
  </div>
)
export const Playground = () => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ maxWidth: '60vw' }}>
      <h3>Start of presentation of motion</h3>
      <LmMotion
        content={{
          ...storyMotion({ options: { duration: 5000 } }),
          body
        }}
      />
      <h3>End of presentation of motion</h3>
    </div>
  </div>
)

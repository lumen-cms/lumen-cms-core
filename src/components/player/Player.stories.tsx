import { LmComponentRender as LmPlayer } from '@LmComponentRender'
import { storyPlayer } from '../../storybook/core/various'

export default {
  title: 'Design/Data Display/Player'
}

export const Playground = () => (
  <div
    style={{
      maxWidth: '500px',
      margin: '0 auto'
    }}
  >
    <LmPlayer
      content={storyPlayer({
        options: {
          url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U'
        }
      })}
    />
  </div>
)

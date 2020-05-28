import * as React from 'react'
import { storyPlayer } from '../src/storybook/core/various'
import { LmComponentRender as LmPlayer } from '../src/'

export default {
  title: 'Player'
}

export const Playground = () => (
  <div style={{
    maxWidth: '500px',
    margin: '0 auto'
  }}>
    <LmPlayer content={storyPlayer({
      options: {
        url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U'
      }
    })} />
  </div>
)

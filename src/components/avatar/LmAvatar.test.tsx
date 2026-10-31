import type { ComponentProps } from 'react'
import type { AvatarProps } from '@mui/material/Avatar'
import type LmSquareImage from './LmSquareImage'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { LmAvatar } from './LmAvatar'
const capture = vi.hoisted(() => ({
  props: {} as AvatarProps,
  image: {} as Partial<ComponentProps<typeof LmSquareImage>>
}))
vi.mock('@mui/material/Avatar', () => ({
  default: (props: AvatarProps) => {
    capture.props = props
    return <div>{props.children}</div>
  }
}))
vi.mock('./LmSquareImage', () => ({
  default: (props: ComponentProps<typeof LmSquareImage>) => {
    capture.image = props
    return <span>Image</span>
  }
}))
vi.mock('../icon/LmIcon', () => ({
  default: ({ iconName }: { iconName: string }) => <span>{iconName}</span>
}))
it.each([
  ['dense', 30, 14],
  ['large', 50, 21],
  ['xlarge', 64, 28]
] as const)('preserves %s letter sizing', (size, width, fontSize) => {
  const html = renderToStaticMarkup(
    <LmAvatar content={{ _uid: 'a', component: 'avatar', size, letter: 'A' }} />
  )
  expect(capture.props.style).toMatchObject({ width, height: width, fontSize })
  expect(capture.props.variant).toBe('circular')
  expect(html).toContain('A')
})
it('preserves custom/font overrides, image background and content ordering', () => {
  const html = renderToStaticMarkup(
    <LmAvatar
      content={{
        _uid: 'a',
        component: 'avatar',
        size: 'dense',
        custom_size: '90',
        font_size: '17',
        icon: { name: 'Star' },
        image: '/avatar.png',
        letter: 'A',
        variant: 'square',
        color: { rgba: 'red' },
        background_color: { rgba: 'blue' },
        class_names: { values: ['custom'] }
      }}
    />
  )
  expect(capture.props.style).toEqual({
    width: 90,
    height: 90,
    fontSize: 17,
    color: 'red',
    backgroundColor: 'transparent'
  })
  expect(capture.props.variant).toBe('square')
  expect(capture.props.className).toBe('custom')
  expect(capture.image).toEqual({ image: '/avatar.png', size: 90 })
  expect(html).toBe('<div><span>Image</span>A<span>Star</span></div>')
})
it('preserves icon size and custom background without an image', () => {
  renderToStaticMarkup(
    <LmAvatar
      content={{
        _uid: 'a',
        component: 'avatar',
        size: 'large',
        icon: { name: 'Star' },
        background_color: { rgba: 'blue' },
        variant: 'rounded'
      }}
    />
  )
  expect(capture.props.style).toMatchObject({
    width: 50,
    height: 50,
    fontSize: 25,
    backgroundColor: 'blue'
  })
  expect(capture.props.variant).toBe('rounded')
})

// @vitest-environment happy-dom
import { act, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmSectionVideo from './SectionVideoBg'

type Dimensions = { width: number; height: number }
const fixture = vi.hoisted(() => ({
  inView: false,
  node: null as HTMLDivElement | null,
  entry: undefined as { target: Element } | undefined,
  commits: [] as Dimensions[],
  cleanup: vi.fn()
}))
vi.mock('react-intersection-observer', () => {
  const ref = (element: HTMLDivElement | null) => {
    fixture.node = element
    return fixture.cleanup
  }
  return { useInView: () => [ref, fixture.inView, fixture.entry] }
})
vi.mock('next/dynamic', () => ({
  default: () =>
    function Video({
      containerDimensions
    }: {
      containerDimensions: Dimensions
    }) {
      useLayoutEffect(() => {
        fixture.commits.push(containerDimensions)
      })
      return null
    }
}))
vi.mock('../CoreComponents', () => ({ LmComponentRender: () => null }))

it('measures committed DOM only at the existing visibility and configuration boundaries', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  fixture.inView = false
  fixture.entry = undefined
  fixture.commits = []
  fixture.cleanup.mockClear()
  const root = createRoot(document.createElement('div'))
  const size = { width: 100, height: 50 }
  const render = async (
    url = 'https://example.test/one.mp4',
    height: string | undefined = '50'
  ) => {
    await act(async () =>
      root.render(
        <LmSectionVideo
          content={{
            component: 'section_video_bg',
            _uid: 'video',
            url,
            height
          }}
        />
      )
    )
  }
  try {
    await render()
    expect(fixture.commits[0]).toEqual({ width: 0, height: 0 })
    const node = fixture.node!
    Object.defineProperties(node, {
      clientWidth: { configurable: true, get: () => size.width },
      clientHeight: { configurable: true, get: () => size.height }
    })
    fixture.entry = { target: node }
    fixture.inView = true
    await render()
    expect(fixture.commits.at(-1)).toEqual({ width: 100, height: 50 })
    size.width = 200
    size.height = 100
    await render()
    expect(fixture.commits.at(-1)).toEqual({ width: 100, height: 50 })
    await render('https://example.test/two.mp4')
    expect(fixture.commits.at(-1)).toEqual({ width: 200, height: 100 })
    fixture.inView = false
    size.width = 300
    await render('https://example.test/three.mp4')
    expect(fixture.commits.at(-1)).toEqual({ width: 200, height: 100 })
    fixture.inView = true
    await render('https://example.test/three.mp4', '')
    expect(fixture.commits.at(-1)).toEqual({ width: 200, height: 100 })
    await render('https://example.test/three.mp4', '50')
    expect(fixture.commits.at(-1)).toEqual({ width: 300, height: 100 })
  } finally {
    await act(async () => root.unmount())
    expect(fixture.cleanup).toHaveBeenCalledOnce()
    fixture.node = null
    fixture.entry = undefined
  }
})

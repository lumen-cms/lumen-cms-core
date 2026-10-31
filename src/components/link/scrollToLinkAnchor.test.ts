// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { scrollToLinkAnchor } from './scrollToLinkAnchor'

afterEach(() => document.body.replaceChildren())

function fixture() {
  const destination = document.createElement('div')
  destination.id = 'section'
  const scroll = vi.fn()
  destination.scrollIntoView = scroll
  const target = document.createElement('a')
  document.body.append(destination, target)
  const preventDefault = vi.fn()
  return { destination, scroll, target, preventDefault }
}

it('prevents navigation and scrolls synchronously before the promise settles', async () => {
  const event = fixture()
  const result = scrollToLinkAnchor('/page#section#ignored', event)
  expect(event.preventDefault).toHaveBeenCalledOnce()
  expect(event.scroll).toHaveBeenCalledExactlyOnceWith({ behavior: 'smooth' })
  await expect(result).resolves.toBeUndefined()
})

it.each(['/page', '/page#', '/page#missing'])(
  'leaves navigation alone for %s',
  async (href) => {
    const event = fixture()
    await scrollToLinkAnchor(href, event)
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.scroll).not.toHaveBeenCalled()
  }
)

it('leaves drawer navigation alone', async () => {
  const event = fixture()
  const drawer = document.createElement('div')
  drawer.className = 'MuiDrawer-root'
  drawer.append(event.target)
  document.body.append(drawer)
  await scrollToLinkAnchor('#section', event)
  expect(event.preventDefault).not.toHaveBeenCalled()
  expect(event.scroll).not.toHaveBeenCalled()
})

it('retains rejected promises for DOM failures after preventing navigation', async () => {
  const event = fixture()
  const error = new Error('scroll failed')
  event.scroll.mockImplementation(() => {
    throw error
  })
  const result = scrollToLinkAnchor('#section', event)
  expect(event.preventDefault).toHaveBeenCalledOnce()
  await expect(result).rejects.toBe(error)
})

// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { onUnmount } from '../../packages/lumen-cms-astro/src/client/lifecycle'

afterEach(() => {
 document.dispatchEvent(new Event('astro:before-swap'))
 document.body.replaceChildren()
})

it('disposes descendants only when their containing content is removed', () => {
 document.body.innerHTML = '<dialog><section><button></button></section></dialog><aside></aside>'
 const dispose = vi.fn()
 onUnmount(document.querySelector('button')!, dispose)
 document.querySelector('aside')!.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 expect(dispose).not.toHaveBeenCalled()
 document.querySelector('dialog')!.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 expect(dispose).toHaveBeenCalledTimes(1)
 document.dispatchEvent(new Event('astro:before-swap'))
 expect(dispose).toHaveBeenCalledTimes(1)
})

it('disposes once on navigation even if its dialog later closes', () => {
 const root = document.createElement('dialog')
 document.body.append(root)
 const dispose = vi.fn()
 onUnmount(root, dispose)
 document.dispatchEvent(new Event('astro:before-swap'))
 root.dispatchEvent(new CustomEvent('lumen:content-unmount', { bubbles: true }))
 expect(dispose).toHaveBeenCalledTimes(1)
})

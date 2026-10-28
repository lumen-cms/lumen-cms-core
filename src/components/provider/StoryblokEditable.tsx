import { storyblokEditable } from '@storyblok/react'
import { useEffect, useRef, type PropsWithChildren } from 'react'

// Legacy consumer components don't consistently forward DOM props or refs.
// Inert markers let the official attributes reach their rendered root without
// findDOMNode (removed in React 19) or a layout-changing wrapper element.
export function StoryblokEditable({
  content,
  children
}: PropsWithChildren<{ content: { _editable?: string } }>) {
  const start = useRef<HTMLTemplateElement>(null)
  const end = useRef<HTMLTemplateElement>(null)
  useEffect(() => {
    const attributes = storyblokEditable(content)
    const parent = start.current?.parentElement
    if (!parent || !attributes['data-blok-uid']) return
    let target: Element | null = null
    const clear = () => {
      if (
        target?.getAttribute('data-blok-uid') === attributes['data-blok-uid']
      ) {
        target.removeAttribute('data-blok-c')
        target.removeAttribute('data-blok-uid')
        target.classList.remove('storyblok__outline')
      }
    }
    const attach = () => {
      let element = start.current?.nextElementSibling || null
      while (
        element &&
        element !== end.current &&
        ['TEMPLATE', 'STYLE', 'SCRIPT'].includes(element.tagName)
      ) {
        element = element.nextElementSibling
      }
      if (!element || element === end.current) return
      if (target !== element) clear()
      target = element
      Object.entries(attributes).forEach(([name, value]) =>
        target!.setAttribute(name, value)
      )
      target.classList.add('storyblok__outline')
    }
    attach()
    // Also cover a lazy component replacing its fallback after mount.
    const observer = new MutationObserver(attach)
    observer.observe(parent, { childList: true })
    return () => {
      observer.disconnect()
      clear()
    }
  }, [content])
  return (
    <>
      <template ref={start} />
      {children}
      <template ref={end} />
    </>
  )
}

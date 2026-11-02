import { storyblokEditable } from '@storyblok/react'
import { useEffect, type RefObject } from 'react'

// This controller has no DOM output. Loading it never replaces the CMS child.
export default function StoryblokEditableAttributes({
  content,
  start,
  end
}: {
  content: { _editable?: string }
  start: RefObject<HTMLTemplateElement | null>
  end: RefObject<HTMLTemplateElement | null>
}): null {
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
  }, [content, start, end])
  return null
}

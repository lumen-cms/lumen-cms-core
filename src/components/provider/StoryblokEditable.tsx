import dynamic from 'next/dynamic'
import { useRef, type PropsWithChildren } from 'react'

const StoryblokEditableAttributes = dynamic(
  () => import('./StoryblokEditableAttributes'),
  { ssr: false }
)

// Legacy consumer components don't consistently forward DOM props or refs.
// Inert markers let the official attributes reach their rendered root without
// findDOMNode (removed in React 19) or a layout-changing wrapper element.
export function StoryblokEditable({
  content,
  children
}: PropsWithChildren<{ content: { _editable?: string } }>) {
  const start = useRef<HTMLTemplateElement>(null)
  const end = useRef<HTMLTemplateElement>(null)
  return (
    <>
      <template ref={start} />
      {children}
      <template ref={end} />
      <StoryblokEditableAttributes content={content} start={start} end={end} />
    </>
  )
}

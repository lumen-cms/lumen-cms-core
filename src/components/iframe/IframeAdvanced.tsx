import React, {
  createRef,
  RefObject,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useInView } from 'react-intersection-observer'
import CircularProgress from '@material-ui/core/CircularProgress'
import { IframeAdvancedStoryblok } from '../../typings/generated/components-schema'
import { intersectionIframeOptions } from '../../utils/intersectionObserverConfig'

export type LmIframeAdvancedProps = { content: IframeAdvancedStoryblok }

export function LmIframeAdvanced({
  content
}: LmIframeAdvancedProps): JSX.Element {
  const [refIntersectionObserver, inView, containerRef] = useInView(
    intersectionIframeOptions
  )
  const iframeRef: RefObject<HTMLIFrameElement> = createRef()
  // const [src, setSrc] = useState<string>('')
  const contentId = `iframe_${content._uid}`
  const properties = content.property || []
  const allowed = content.allow || []
  const [loaded, setLoaded] = useState<boolean>(false)
  const contentUrl = content.url
  const src = useMemo(() => {
    if (inView) {
      return contentUrl
    }
    return ''
  }, [inView, contentUrl])

  useEffect(() => {
    const messageFunc = (message: any) => {
      const clientHeight =
        message &&
        message.data &&
        message.data[content.incoming_message_key || 'stClientHeight']
      const el =
        containerRef && containerRef.target && containerRef.target.firstChild
      if (clientHeight && el) {
        const iframe = el as HTMLIFrameElement
        iframe.style.minHeight = `${clientHeight}px`
      }
    }
    const clickFunc = () => {
      const el =
        containerRef && containerRef.target && containerRef.target.firstChild
      if (el) {
        const iframe = el as HTMLIFrameElement
        const { contentWindow } = iframe
        contentWindow &&
          contentWindow.postMessage(
            content.post_message_key || '_clickOutside',
            '*'
          )
      }
    }
    window.addEventListener('message', messageFunc)
    window.addEventListener('click', clickFunc)
    return () => {
      window.removeEventListener('message', messageFunc)
      window.removeEventListener('click', clickFunc)
    }
  }, [containerRef, content.incoming_message_key, content.post_message_key])

  return (
    <div ref={refIntersectionObserver}>
      {!loaded && inView && (
        <div className="p-5">
          <CircularProgress />
        </div>
      )}
      <iframe
        title={`iframe_${contentUrl}`}
        ref={iframeRef}
        id={contentId}
        allow={allowed.join(' ')}
        frameBorder={0}
        scrolling="no"
        onLoad={() => setLoaded(true)}
        allowFullScreen={properties.includes('allow_fullscreen') || false}
        src={src}
        className="border-0"
        style={{
          overflowY: 'hidden',
          display: content.display,
          height: '100%',
          minHeight: content.height ? `${content.height}px` : undefined,
          width: content.width || '100%'
        }}
      />
    </div>
  )
}

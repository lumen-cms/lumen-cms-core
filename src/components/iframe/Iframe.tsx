import { useInView } from 'react-intersection-observer'
import { useMemo, useState, useSyncExternalStore } from 'react'
import Skeleton from '@mui/material/Skeleton'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmIframeProps } from './iframeTypes'
import clsx from 'clsx'
import { getIframeSandbox } from './iframeSandbox'

// An origin change replaces the document; no in-document subscription is needed.
const subscribeToOrigin = () => () => {}
const getBrowserOrigin = () => window.location.origin
const getServerOrigin = () => undefined

export default function LmIframe({
  content
}: LmIframeProps): React.JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const [loaded, setLoaded] = useState<boolean>(false)
  const parentOrigin = useSyncExternalStore(
    subscribeToOrigin,
    getBrowserOrigin,
    getServerOrigin
  )
  const urlSrc = useMemo(() => {
    if (inView && parentOrigin) {
      return content.url || undefined
    }
    return undefined
  }, [content.url, inView, parentOrigin])
  const properties = content.property || []
  const allowed = content.allow || []
  content.responsive_ratio

  return (
    <div
      ref={refIntersectionObserver}
      className={clsx({
        'embed-responsive': !!content.responsive_ratio,
        [`embed-responsive-${content.responsive_ratio}`]:
          !!content.responsive_ratio
      })}
      style={{
        height: content.full_height ? '100%' : undefined
      }}
    >
      {!loaded && (
        <Skeleton
          style={{ position: 'absolute' }}
          width="100%"
          height="100%"
          variant="rectangular"
        />
      )}
      <iframe
        title={`iframe_${content.url}`}
        sandbox={getIframeSandbox(urlSrc, parentOrigin)}
        allow={allowed.join(' ')}
        src={urlSrc}
        aria-hidden
        frameBorder={0}
        onLoad={() => setLoaded(true)}
        className={clsx({
          'embed-responsive-item': !!content.responsive_ratio
        })}
        allowFullScreen={properties.includes('allow_fullscreen') || false}
        height={content.height || '100%'}
        name={content.name || ''}
        width={content.width || '100%'}
        style={{
          position: content.position,
          display: content.display,
          height: content.height || '100%',
          width: content.width || '100%'
        }}
      />
    </div>
  )
}

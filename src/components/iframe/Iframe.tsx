import { useInView } from 'react-intersection-observer'
import React, { useMemo, useState } from 'react'
import clsx from 'clsx'
import Skeleton from '@material-ui/lab/Skeleton'
import { intersectionDefaultOptions } from '../../utils/intersectionObserverConfig'
import { LmIframeProps } from './iframeTypes'

export default function LmIframe({ content }: LmIframeProps): JSX.Element {
  const [refIntersectionObserver, inView] = useInView(
    intersectionDefaultOptions
  )
  const [loaded, setLoaded] = useState<boolean>(false)
  const urlSrc = useMemo(() => {
    if (inView) {
      return content.url
    }
    return ''
  }, [content.url, inView])
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
          variant="rect"
        />
      )}
      <iframe
        title={`iframe_${content.url}`}
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

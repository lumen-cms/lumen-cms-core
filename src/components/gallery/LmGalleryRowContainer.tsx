import { FC, useEffect, useRef, useState } from 'react'
import { Grid } from '@material-ui/core'
import { LmGalleryRowProps } from './LmGalleryRow'
import { useInView } from 'react-intersection-observer'

const LmGalleryRowContainer: FC<LmGalleryRowProps> = ({
  children,
  options,
  content
}) => {
  const offset = useRef<number>(0)
  const [leftTransition, setLeftTransition] = useState<number>(0)
  const [ref, inView, refElement] = useInView()
  const galleryRowRef = useRef<HTMLDivElement>(null)
  const galleryTarget = refElement?.target
  const [scrollY, setScrollY] = useState<number>(0)

  useEffect(() => {
    const setOffset = () => {
      if (!galleryTarget) {
        return
      }
      let rect = galleryRowRef.current?.getBoundingClientRect()
      offset.current = Math.round((rect?.top || 0) + window.scrollY)
      if (!content.scroll_to_left) {
        let contentWidth = galleryRowRef.current?.scrollWidth || 0
        const left = window.innerWidth - contentWidth
        setLeftTransition(left)
      }
    }
    window.addEventListener('resize', setOffset)
    setOffset()
    return () => {
      window.removeEventListener('resize', setOffset)
    }
  }, [content.scroll_to_left, galleryTarget])

  useEffect(() => {
    const handleScroll = () => {
      if (!galleryRowRef.current) {
        return
      }
      const y = window.scrollY + window.innerHeight - offset.current
      let number = content.scroll_to_left ? y * -1 : y
      setScrollY(number)
    }
    const cleanUp = () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
    if (inView) {
      window.addEventListener('scroll', handleScroll, {
        passive: true
      })
      window.addEventListener('resize', handleScroll)
    } else {
      cleanUp()
    }
    // handleScroll()
    return () => {
      cleanUp()
    }
  }, [inView, galleryTarget, content.scroll_to_left])
  return (
    <div
      id={'row-' + content._uid}
      ref={ref}
      style={{
        ...(leftTransition && {
          marginLeft: leftTransition
        })
      }}
    >
      <Grid
        ref={galleryRowRef}
        direction={'row'}
        container
        wrap={'nowrap'}
        className={'lm-gallery-row'}
        style={{
          gap: options.space_between_images + 'px',
          transform: inView
            ? `translate3d(${scrollY}px, 0px, 0px)`
            : 'matrix(1, 0, 0, 1, 0, 0)'
        }}
      >
        {children}
      </Grid>
    </div>
  )
}

export default LmGalleryRowContainer

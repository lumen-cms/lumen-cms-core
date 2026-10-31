import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { useParallaxController, type BannerLayer } from 'react-scroll-parallax'

type Props = BannerLayer & {
  active: boolean
  bannerRef: RefObject<HTMLDivElement | null>
}

// Keep the banner's absolute positioning and expanded image edges in CSS even
// before animation registration. Percentage offsets follow the banner's size.
function expandedStyle({ expanded = true, translateY, speed }: BannerLayer) {
  if (!expanded) return {}
  if (translateY) {
    const unit = (value: string | number) => {
      if (typeof value === 'number' || /^-?[\d.]+$/.test(value)) return '%'
      if (value.endsWith('px')) return 'px'
      if (value.endsWith('%')) return '%'
      return undefined
    }
    const start = translateY[0]
    const end = translateY[1]
    if (unit(start) && unit(start) === unit(end)) {
      return {
        top: `${-Math.abs(parseFloat(String(end)))}${unit(end)}`,
        bottom: `${-Math.abs(parseFloat(String(start)))}${unit(start)}`
      }
    }
  }
  return speed
    ? { top: -Math.abs(speed) * 10, bottom: -Math.abs(speed) * 10 }
    : {}
}

export function DeferredParallaxLayer(props: Props) {
  const { active, bannerRef, children, style, expanded, image } = props
  const ref = useRef<HTMLDivElement>(null)
  const controller = useParallaxController()

  useEffect(() => {
    if (!active || !controller || !ref.current || !bannerRef.current) return
    const {
      active: _active,
      bannerRef: _bannerRef,
      children: _children,
      style: _style,
      expanded: _expanded,
      image: _image,
      ...animation
    } = props
    const element = controller.createElement({
      el: ref.current,
      props: {
        shouldDisableScalingTranslations: true,
        ...animation,
        targetElement: bannerRef.current
      }
    })
    return () => {
      controller.resetElementStyles(element)
      controller.removeElementById(element.id)
    }
    // Props describe the CMS layer; updates in preview re-register that layer.
  }, [active, controller, bannerRef, props])

  const layerStyle: CSSProperties = {
    ...(image && {
      backgroundImage: `url(${image})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover'
    }),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...expandedStyle({
      expanded,
      translateY: props.translateY,
      speed: props.speed
    }),
    ...style
  }

  return (
    <div ref={ref} style={layerStyle}>
      {children}
    </div>
  )
}

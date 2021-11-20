import { GalleryStoryblok } from '../../typings/generated/components-schema'
import LmGalleryRow from './LmGalleryRow'
import { useInView } from 'react-intersection-observer'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'

type LmGalleryProps = {
  content: GalleryStoryblok
}
export default function LmGallery({ content }: LmGalleryProps) {
  const [ref, inView] = useInView()
  const imageStyles = useStylesAdvanced({
    props: content.image_style
  })

  return (
    <div
      className={'lm-gallery'}
      ref={ref}
      style={{
        ...(content.rotate && {
          transform: `rotate(${content.rotate}deg)`
        })
      }}
    >
      {content.content?.map((blok) => (
        <LmGalleryRow
          content={blok}
          key={blok._uid}
          options={content}
          inView={inView}
          imageStyles={imageStyles}
        />
      ))}
    </div>
  )
}

import { GalleryStoryblok } from '../../typings/generated/components-schema'
import LmGalleryRow from './LmGalleryRow'
import { getAdvancedSx } from '../../utils/hooks/useStylesAdvanced'

type LmGalleryProps = {
  content: GalleryStoryblok
}
export default function LmGallery({ content }: LmGalleryProps) {
  const imageSx = getAdvancedSx({
    props: content.image_style
  })

  return (
    <div
      className={'lm-gallery'}
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
          imageSx={imageSx}
        />
      ))}
    </div>
  )
}

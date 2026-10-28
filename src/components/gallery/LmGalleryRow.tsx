import {
  GalleryRowStoryblok,
  GalleryStoryblok
} from '../../typings/generated/components-schema'
import LmGalleryImage from './LmGalleryImage'
import type { AdvancedSx } from '../../utils/hooks/useStylesAdvanced'
import Grid from '../../vendor/grid'
import LmGalleryRowContainer from './LmGalleryRowContainer'

export type LmGalleryRowProps = {
  content: GalleryRowStoryblok
  options: GalleryStoryblok
  imageSx: AdvancedSx
}

export default function LmGalleryRow(props: LmGalleryRowProps) {
  const { content, options, imageSx } = props
  const length = content.content?.length || 0
  return (
    <LmGalleryRowContainer {...props}>
      {content.content?.map((blok, index) => (
        <Grid xs="auto" key={blok._uid}>
          <LmGalleryImage content={blok} options={options} imageSx={imageSx} />
          {index < length && (
            <div
              style={{ paddingBottom: options.space_between_rows + 'px' }}
            ></div>
          )}
        </Grid>
      ))}
    </LmGalleryRowContainer>
  )
}

import {
  GalleryRowStoryblok,
  GalleryStoryblok
} from '../../typings/generated/components-schema'
import LmGalleryImage from './LmGalleryImage'
import { ClassNameMap } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import LmGalleryRowContainer from './LmGalleryRowContainer'

export type LmGalleryRowProps = {
  content: GalleryRowStoryblok
  options: GalleryStoryblok
  imageStyles: ClassNameMap<'advanced'>
}

export default function LmGalleryRow(props: LmGalleryRowProps) {
  const { content, options, imageStyles } = props
  const length = content.content?.length || 0
  return (
    <LmGalleryRowContainer {...props}>
      {content.content?.map((blok, index) => (
        <Grid xs="auto" key={blok._uid}>
          <LmGalleryImage
            content={blok}
            options={options}
            imageStyles={imageStyles}
          />
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

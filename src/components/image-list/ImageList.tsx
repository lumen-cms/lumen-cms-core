import { useState } from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { LmComponentRender } from '../CoreComponents'
import { LmCoreComponents } from '../../utils/config'
import dynamic from 'next/dynamic'
import { imageListAspectRatioSx, imageListRootSx } from './imageListStyles'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmImageListProps } from './imageListTypes'
import { COLUMN_COUNT } from '../card/cardListStyles'
import Box from '@mui/material/Box'
import clsx from 'clsx'

const ImageListLightbox = dynamic(() => import('./ImageListLightbox'))

function getImageListSx(
  content: LmImageListProps['content'],
  isMasonry: boolean
) {
  return {
    '& .MuiImageListItem-woven, & .MuiImageListItem-quilted': {
      overflow: 'hidden',
      '& > span': {
        height: '100%!important',
        width: '100%!important'
      }
    },
    ...(!isMasonry
      ? {
          gridTemplateColumns: {
            xs: `repeat(${
              content.column_count_phone ||
              content.column_count ||
              COLUMN_COUNT.PHONE
            }, 1fr)!important`,
            sm: `repeat(${
              content.column_count_tablet ||
              content.column_count ||
              COLUMN_COUNT.TABLET
            }, 1fr)!important`,
            lg: `repeat(${
              content.column_count || COLUMN_COUNT.DESKTOP
            }, 1fr)!important`
          }
        }
      : {
          columnCount: {
            xs: `${
              content.column_count_phone ||
              content.column_count ||
              COLUMN_COUNT.PHONE_MASONRY
            }!important`,
            sm: `${
              content.column_count_tablet ||
              content.column_count ||
              COLUMN_COUNT.TABLET
            }!important`,
            lg: `${content.column_count || COLUMN_COUNT.DESKTOP}!important`
          }
        })
  }
}

export default function LmImageList({
  content
}: LmImageListProps): React.JSX.Element {
  const [lightbox, setLightbox] = useState('')

  const gutterSize = content.column_gap ? Number(content.column_gap) : 2

  const onImageClick = (element: any) => {
    content.enable_lightbox && setLightbox(element._uid)
  }

  const body = content.body || []

  const isMasonry = content.variant === 'masonry' || content.masonry
  const hasAspectRatio = !!(content.aspect_ratio && !isMasonry)

  return (
    <div className="lm-imagelist__container">
      <Box
        className={clsx({
          [`ratio-${content.aspect_ratio}`]: hasAspectRatio,
          'with-lightbox': content.enable_lightbox
        })}
        sx={[imageListRootSx, hasAspectRatio && imageListAspectRatioSx]}
      >
        <ImageList
          rowHeight={content.row_height ? Number(content.row_height) : 'auto'}
          gap={gutterSize}
          variant={content.variant || (isMasonry ? 'masonry' : 'standard')}
          sx={getImageListSx(content, !!isMasonry)}
        >
          {body.map((item, i) => {
            const btnProps: any =
              item.link?.cached_url && !content.enable_lightbox
                ? {
                    ...getLinkAttrs(item.link as LinkType, {
                      openExternal: !!item.open_external
                    }),
                    naked: true,
                    component: LmCoreComponents.lm_link_render
                  }
                : {}
            return (
              <ImageListItem
                cols={item.cols ? Number(item.cols) : 1}
                rows={item.rows ? Number(item.rows) : 1}
                key={item._uid}
                {...btnProps}
                onClick={(ev: any) =>
                  onImageClick({ _uid: item._uid, count: i, ...ev })
                }
              >
                <LmComponentRender content={item} listProps={content} />
              </ImageListItem>
            )
          })}
        </ImageList>
      </Box>
      {lightbox && (
        <ImageListLightbox
          elements={body}
          lightbox={lightbox}
          setLightbox={setLightbox}
          onImageClick={onImageClick}
        />
      )}
    </div>
  )
}

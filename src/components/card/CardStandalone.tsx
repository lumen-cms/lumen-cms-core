import Card from '@mui/material/Card'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import { LmCardStandaloneProps } from './cardTypes'
import CardContent from '@mui/material/CardContent'
import { LmComponentRender } from '@LmComponentRender'
import useBackgroundBox from '../section/useBackgroundBox'
import BackgroundImage from '../section/BackgroundImage'
import BackgroundElements from '../section/BackgroundElements'
import React, { FC } from 'react'
import CardMedia from '@mui/material/CardMedia'
import Image from 'next/image'
import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmCoreComponents } from '@CONFIG'

export default function LmCardStandalone({ content }: LmCardStandaloneProps) {
  const {
    body,
    body_above_media,
    body_on_hover,
    media,
    elevation,
    square,
    styles,
    styles_hover,
    styles_mobile,
    styles_tablet,
    media_aspect_ratio,
    media_max_width,
    object_fit,
    object_position,
    content_padding,
    media_margin,
    full_height,
    link,
    variant
  } = content
  const background: BackgroundStoryblok | undefined = content.background?.[0]

  const { className, style } = useBackgroundBox({
    background,
    styles: styles,
    stylesMobile: styles_mobile,
    stylesTablet: styles_tablet,
    stylesHover: styles_hover
  })
  const hasHoverContent = !!body_on_hover?.length
  const btnProps = content.link?.linktype
    ? {
        ...getLinkAttrs(link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LmCoreComponents.lm_link_render
      }
    : undefined
  const ActionArea: FC = ({ children }) =>
    btnProps?.href ? (
      <CardActionArea {...btnProps} sx={{ height: '100%' }}>
        {children}
      </CardActionArea>
    ) : (
      <>{children}</>
    )

  return (
    <Card
      elevation={elevation ? Number(elevation) : undefined}
      square={square}
      className={className}
      style={style}
      variant={variant || 'elevation'}
      sx={{
        position: 'relative',
        height: full_height ? '100%' : undefined,
        '& .lm-main__hover': {
          display: 'none'
        },
        '&:hover': {
          '& .lm-main__hover': {
            display: 'flex'
          }
        }
      }}
    >
      {background?.image && <BackgroundImage content={background} />}
      {!!background?.background_elements?.length && (
        <BackgroundElements elements={background.background_elements} />
      )}
      <ActionArea>
        {!!body_above_media?.length && (
          <CardContent
            sx={{
              position: 'relative',
              padding: (theme) =>
                content_padding
                  ? theme.spacing(Number(content_padding))
                  : undefined
            }}
          >
            {body_above_media?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </CardContent>
        )}
        {!!media?.filename && (
          <CardMedia
            sx={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: media_aspect_ratio || '3/2',
              margin: (theme) =>
                media_margin ? theme.spacing(Number(media_margin)) : undefined
            }}
          >
            <Image
              src={media?.filename}
              layout={'fill'}
              objectFit={object_fit || 'cover'}
              objectPosition={object_position || 'center'}
              sizes={media_max_width ? media_max_width + 'px' : '300px'}
              alt={media?.alt || 'card image'}
            />
          </CardMedia>
        )}
        {!!body?.length && (
          <CardContent
            sx={{
              position: 'relative',
              padding: (theme) =>
                content_padding
                  ? theme.spacing(Number(content_padding))
                  : undefined
            }}
          >
            {body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </CardContent>
        )}
        {hasHoverContent && (
          <Box
            className={'lm-main__hover'}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex'
            }}
          >
            {body_on_hover?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Box>
        )}
      </ActionArea>
    </Card>
  )
}

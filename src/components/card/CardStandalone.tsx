import Card from '@mui/material/Card'
import MuiCardActions from '@mui/material/CardActions'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import { LmCardStandaloneProps } from './cardTypes'
import CardContent from '@mui/material/CardContent'
import { LmComponentRender } from '../CoreComponents'
import useBackgroundBox from '../section/useBackgroundBox'
import BackgroundImage from '../section/BackgroundImage'
import BackgroundElements from '../section/BackgroundElements'
import { PropsWithChildren } from 'react'
import CardMedia from '@mui/material/CardMedia'
import Image from 'next/image'
import Box from '@mui/material/Box'
import CardActionArea from '@mui/material/CardActionArea'
import {
  getLinkAttrs,
  LinkType,
  LinkHandlerProps
} from '../../utils/linkHandler'
import { LmCoreComponents } from '../../utils/config'

function ActionArea({
  children,
  buttonProps
}: PropsWithChildren<{ buttonProps?: LinkHandlerProps }>) {
  return buttonProps?.href ? (
    <CardActionArea {...buttonProps} sx={{ height: '100%' }}>
      {children}
    </CardActionArea>
  ) : (
    <>{children}</>
  )
}

function StandaloneCardMedia({ content }: LmCardStandaloneProps) {
  if (!content.media?.filename) return null
  return (
    <CardMedia
      sx={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: content.media_aspect_ratio || '3/2',
        margin: (theme) =>
          content.media_margin
            ? theme.spacing(Number(content.media_margin))
            : undefined
      }}
    >
      <Image
        src={content.media?.filename}
        fill
        style={{
          objectFit: content.object_fit || 'cover',
          objectPosition: content.object_position || 'center'
        }}
        sizes={
          content.media_max_width ? content.media_max_width + 'px' : '300px'
        }
        alt={content.media?.alt || 'card image'}
      />
    </CardMedia>
  )
}

export default function LmCardStandalone({ content }: LmCardStandaloneProps) {
  const background: BackgroundStoryblok | undefined = content.background?.[0]

  const { className, style, sx } = useBackgroundBox({
    background,
    styles: content.styles,
    stylesMobile: content.styles_mobile,
    stylesTablet: content.styles_tablet,
    stylesHover: content.styles_hover
  })
  const hasHoverContent = !!content.body_on_hover?.length
  const btnProps = content.link?.linktype
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LmCoreComponents.lm_link_render
      }
    : undefined
  return (
    <Card
      elevation={content.elevation ? Number(content.elevation) : undefined}
      square={content.square}
      className={className}
      style={style}
      variant={content.variant || 'elevation'}
      sx={[
        {
          position: 'relative',
          height: content.full_height ? '100%' : undefined,
          display: 'flex',
          flexDirection: 'column',
          '& .lm-main__hover': {
            display: 'none'
          },
          '&:hover': {
            '& .lm-main__hover': {
              display: 'flex'
            }
          }
        },
        ...sx
      ]}
    >
      {background?.image && <BackgroundImage content={background} />}
      {!!background?.background_elements?.length && (
        <BackgroundElements elements={background.background_elements} />
      )}
      <ActionArea buttonProps={btnProps}>
        {!!content.body_above_media?.length && (
          <CardContent
            sx={{
              position: 'relative',
              padding: (theme) =>
                content.content_padding
                  ? theme.spacing(Number(content.content_padding))
                  : undefined
            }}
          >
            {content.body_above_media?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </CardContent>
        )}
        <StandaloneCardMedia content={content} />
        {!!content.body?.length && (
          <CardContent
            sx={{
              position: 'relative',
              flexGrow: 1,
              padding: (theme) =>
                content.content_padding
                  ? theme.spacing(Number(content.content_padding))
                  : undefined
            }}
          >
            {content.body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </CardContent>
        )}
        {!!content.body_actions?.length && (
          <MuiCardActions>
            {content.body_actions?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </MuiCardActions>
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
            {content.body_on_hover?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Box>
        )}
      </ActionArea>
    </Card>
  )
}

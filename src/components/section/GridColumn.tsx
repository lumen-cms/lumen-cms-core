import React from 'react'
import Grid from '@mui/material/Grid'
import { LmComponentRender } from '@LmComponentRender'
import { BackgroundStoryblok } from '../../typings/generated/components-schema'
import BackgroundImage from './BackgroundImage'
import BackgroundElements from './BackgroundElements'
import useBackgroundBox from './useBackgroundBox'
import { LmGridColumnProps } from './sectionTypes'
import WrapGridContainer from './WrapGridContainer'
import Stack from '@mui/material/Stack'
import clsx from 'clsx'

const xsSpanMap = {
  1: 3,
  2: 6,
  3: 9,
  4: 12,
  false: false,
  auto: 'auto',
  true: true
}

const smSpanMap = {
  1: 1,
  2: 2,
  3: 4,
  4: 6,
  5: 7,
  6: 9,
  7: 11,
  8: 12,
  false: false,
  auto: 'auto',
  true: true
}
const mdSpanMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  false: false,
  auto: 'auto',
  true: true
}

export function LmGridColumn({
  content,
  parent
}: LmGridColumnProps): JSX.Element {
  const background: BackgroundStoryblok | undefined = content.background?.[0]
  const { className, style } = useBackgroundBox({
    background,
    styles: content.styles,
    stylesMobile: content.styles_mobile,
    stylesTablet: content.styles_tablet,
    stylesHover: content.styles_hover
  })
  const mdWidth = mdSpanMap[content.width_general as string]
  let smWidth = smSpanMap[content.width_tablet as string]
  if (!smWidth && mdWidth) {
    smWidth = mdWidth
    if (typeof mdWidth === 'number' && mdWidth > 8) {
      smWidth = 12
    }
  }

  const renderStackElement =
    !['column', 'column-reverse'].includes(parent.direction) &&
    (content.justify || content.align_content || content.align_items)
  return (
    <Grid
      item
      xs={content.width_phone ? xsSpanMap[content.width_phone as string] : 12}
      sm={smWidth}
      md={mdWidth}
      className={clsx({
        'lm-column__bg-image': !!background?.image
      })}
    >
      <WrapGridContainer
        className={[className, 'lm-grid-column__wrap']
          .filter((i) => i)
          .join(' ')}
        style={style}
        hasCustomStyles={!!(style || className || background?.image)}
      >
        {background?.image && <BackgroundImage content={background} />}
        {background?.background_elements &&
          background.background_elements.length > 0 && (
            <BackgroundElements elements={background.background_elements} />
          )}
        {renderStackElement ? (
          <Stack
            className={'lm-column-stack__root'}
            direction="column"
            sx={{
              minHeight: '100%'
            }}
            justifyContent={content.justify ? content.justify : undefined}
            alignItems={content.align_items ? content.align_items : undefined}
            alignContent={
              content.align_content ? content.align_content : undefined
            }
          >
            {content.body?.map((blok) => (
              <LmComponentRender content={blok} key={blok._uid} />
            ))}
          </Stack>
        ) : (
          content.body?.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))
        )}
      </WrapGridContainer>
    </Grid>
  )
}

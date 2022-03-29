import React, { CSSProperties } from 'react'
import LmIcon from '../icon/LmIcon'
import { LmDividerProps } from './dividerTypes'
import Divider, { DividerProps } from '@mui/material/Divider'
import { LmComponentRender } from '@LmComponentRender'

export function LmDivider({
  content,
  isStackDivider
}: LmDividerProps): JSX.Element {
  const style: CSSProperties = {}
  const customColor = content.color?.rgba
  const iconName = content.icon?.name
  const iconSize = content.size

  if (iconSize) {
    style.height = `${iconSize}px`
  }

  const childStyle: CSSProperties = {
    borderTopWidth: `${content.thickness || 1}px`
  }
  if (content.width) {
    childStyle.width = `${content.width}%`
  }

  const isVertical = isStackDivider || content.orientation === 'vertical'

  const dividerProps: DividerProps = {
    orientation: isVertical ? 'vertical' : 'horizontal',
    flexItem: isVertical ? true : undefined,
    textAlign: content.alignment || 'center',
    sx: {
      maxWidth: content.width ? `${content.width}%` : undefined,
      marginX: content.width ? `auto` : undefined,
      color: content.theme_color || customColor || 'grey.400',
      borderColor: 'currentColor',
      '&.MuiDivider-vertical': {
        height: content.vertical_height
          ? `${content.vertical_height}px`
          : undefined,
        // height: content.width ? `${content.width}px` : '100%'
        // marginX: 'auto'
        borderRightWidth: (content.thickness || 1) + 'px'
      },
      '& .MuiDivider-wrapper': {
        display: 'flex'
      },
      borderBottomWidth: content.thickness
        ? `${content.thickness}px`
        : undefined,
      '&:not(.MuiDivider-withChildren)': {
        marginY: '10px'
      },
      '&.MuiDivider-withChildren': {
        '&:before': {
          borderColor: 'currentColor',
          borderTopWidth: content.thickness
            ? `${content.thickness || 1}px`
            : undefined,
          marginTop: content.thickness ? `-${content.thickness}px` : undefined
        },
        '&:after': {
          borderColor: 'currentColor',
          borderTopWidth: content.thickness
            ? `${content.thickness || 1}px`
            : undefined,
          marginTop: content.thickness ? `-${content.thickness}px` : undefined
        }
      }
    }
  }
  if (iconName || content.body?.length) {
    dividerProps.children = (
      <>
        {iconName && (
          <LmIcon
            iconName={iconName}
            style={{
              fontSize: `${iconSize}px`
              // marginTop: `${content.thickness || 1}px`
            }}
          />
        )}
        {content.body?.map((blok) => (
          <LmComponentRender key={blok._uid} content={blok} />
        ))}
      </>
    )
  }

  return <Divider {...dividerProps} />
}

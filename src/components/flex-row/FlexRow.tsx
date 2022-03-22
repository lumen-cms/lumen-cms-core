import React, { FC } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { LmFlexRowProps } from './flexRowTypes'
import { useStylesAdvanced } from '../../utils/hooks/useStylesAdvanced'
import Stack, { StackProps } from '@mui/material/Stack'

export const LmFlexRow: FC<LmFlexRowProps> = ({ content, children }) => {
  const body = content.body || []
  const { classes, cx } = useStylesAdvanced({
    props: content.styles,
    propsMobile: content.styles_mobile,
    propsTablet: content.styles_tablet,
    propsHover: content.styles_hover
  })
  const direction: StackProps['direction'] = content.column ? 'column' : 'row'
  return (
    <Stack
      flexWrap={'wrap'}
      direction={{
        xs: content.column_mobile_only ? 'column' : direction,
        sm: direction
      }}
      justifyContent={content.justify ? content.justify : undefined}
      alignItems={content.align_items ? content.align_items : undefined}
      alignContent={content.align_content ? content.align_content : undefined}
      className={cx(content.class_names?.values, {
        'mh-100': content.full_height,
        [classes.advanced]: !!content.styles?.length,
        [classes.advancedMobile]: !!content.styles_mobile?.length,
        [classes.advancedTablet]: !!content.styles_tablet?.length,
        [classes.advancedHover]: !!content.styles_hover?.length
      })}
      gap={Number(content.gap || 0)}
    >
      {children ? (
        <>{children}</>
      ) : (
        body.map((item) => <LmComponentRender content={item} key={item._uid} />)
      )}
    </Stack>
  )
}

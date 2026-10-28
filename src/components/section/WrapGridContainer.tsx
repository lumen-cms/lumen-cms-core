import React, { CSSProperties, FC } from 'react'
import Box from '@mui/material/Box'
import { BackgroundSx } from './useBackgroundBox'

type WrapGridRowProps = {
  className?: string
  style?: CSSProperties
  sx?: BackgroundSx
  hasCustomStyles?: boolean
}

const WrapGridRow: FC<React.PropsWithChildren<WrapGridRowProps>> = ({
  hasCustomStyles,
  style,
  sx,
  children,
  className
}) =>
  hasCustomStyles ? (
    <Box className={className} style={style} sx={sx}>
      {children}
    </Box>
  ) : (
    <>{children}</>
  )

export default WrapGridRow

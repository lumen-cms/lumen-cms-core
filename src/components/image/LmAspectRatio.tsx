import { FC, forwardRef, PropsWithChildren } from 'react'
import { Box, BoxProps } from '@mui/material'

type LmAspectRatioProps = Omit<BoxProps, 'width' | 'height'> & {
  ratio?: string | string[] // string of [width]/[height]: 16/9
}

const LmAspectRatio: FC<PropsWithChildren<LmAspectRatioProps>> = forwardRef(
  function AspRatio({ ratio, children, ...rest }, ref) {
    let ratioArray: string[] = []
    if (ratio) {
      ratioArray = Array.isArray(ratio) ? ratio : [ratio]
    }
    return (
      <Box
        {...rest}
        ref={ref}
        sx={{
          ...rest?.sx,
          ...(ratioArray.length > 0 && {
            position: 'relative',
            '& > span': {
              width: '100%!important',
              position: 'absolute !important',
              top: 0,
              left: 0,
              height: '100%!important'
            },
            '&::before': {
              content: '""',
              display: 'block',
              width: '100%',
              '@supports not (aspect-ratio: 1/1)': {
                height: 0,
                paddingBottom: ratioArray.map((str) => `calc(100%/(${str}))`)
              },
              '@supports (aspect-ratio: 1/1)': {
                aspectRatio: ratioArray.map((str) => `calc(${str})`)
              }
            }
          })
        }}
        style={{
          ...rest?.style
        }}
      >
        {children}
      </Box>
    )
  }
)
export default LmAspectRatio

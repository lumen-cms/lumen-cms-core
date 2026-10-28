import Box from '@mui/material/Box'
import clsx from 'clsx'
import LmIconMwc from './LmIcon'
import { LmIconProps } from './iconTypes'

const iconSizes: Record<string, { fontSize: string; height: string }> = {
  xmall: {
    fontSize: '1rem',
    height: '1rem'
  },
  small: {
    fontSize: '1.25rem',
    height: '1.25rem'
  },
  medium: {
    fontSize: '1.5rem',
    height: '1.5rem'
  },
  large: {
    fontSize: '2.25rem',
    height: '2.25rem'
  },
  xlarge: {
    fontSize: '2.5rem',
    height: '2.5rem'
  },
  xxlarge: {
    fontSize: '3rem',
    height: '3rem'
  },
  xxxlarge: {
    fontSize: '4rem',
    height: '4rem'
  }
}

export function LmIcon({ content, onClick }: LmIconProps): React.JSX.Element {
  const size = iconSizes[content.size || 'medium']
  return (
    <Box
      className={clsx(content.class_names?.values)}
      sx={{ ...size, '& .lm-svg-icon': size }}
    >
      <LmIconMwc
        onClick={() => {
          onClick && onClick()
        }}
        iconUrl={content.icon_url}
        style={{
          color: content.color?.rgba || undefined
        }}
        iconName={content.name?.name}
      />
    </Box>
  )
}

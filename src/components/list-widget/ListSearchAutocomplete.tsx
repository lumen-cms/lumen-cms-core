import React, { useEffect, useRef } from 'react'
import ButtonBase from '@mui/material/ButtonBase'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Magnify from 'mdi-material-ui/Magnify'
import LmIcon from '../icon/LmIcon'
import { LmListSearchAutocompleteProps } from './listWidgetTypes'
import {
  SearchPaletteProvider,
  useSearchPalette
} from './SearchPaletteProvider'

export default function LmListSearchAutocomplete(
  props: LmListSearchAutocompleteProps
): React.JSX.Element {
  return (
    <SearchPaletteProvider>
      <SearchOpener {...props} />
    </SearchPaletteProvider>
  )
}

function getOpenerStyles(content: LmListSearchAutocompleteProps['content']) {
  return {
    display: 'inline-flex',
    verticalAlign: 'middle',
    justifyContent: 'flex-start',
    gap: 1,
    width: content.fullwidth ? '100%' : 220,
    maxWidth: '100%',
    height: content.height ? Number(content.height) : content.large ? 56 : 40,
    px: 1.5,
    color: 'inherit',
    bgcolor: 'action.hover',
    border: content.outlined ? '1px solid' : '1px solid transparent',
    borderColor: content.outlined ? 'divider' : 'transparent',
    borderRadius:
      content.shape === 'square' ? 0 : content.shape === 'rounded' ? '20px' : 1,
    '&.Mui-focusVisible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2
    }
  }
}

function SearchOpenerLabel({ content }: LmListSearchAutocompleteProps) {
  return (
    <Box component="span" sx={{ textAlign: 'left', overflow: 'hidden' }}>
      {content.label && (
        <Box
          component="span"
          sx={{
            display: 'block',
            fontSize: content.placeholder ? '0.75rem' : 'inherit'
          }}
        >
          {content.label}
        </Box>
      )}
      {(content.placeholder || !content.label) && (
        <Box component="span" sx={{ opacity: 0.7 }}>
          {content.placeholder || 'Search'}
        </Box>
      )}
    </Box>
  )
}

function SearchOpener({ content }: LmListSearchAutocompleteProps) {
  const palette = useSearchPalette()!
  const opener = useRef({ content })
  useEffect(() => {
    opener.current.content = content
  }, [content])
  useEffect(() => palette.register(opener.current), [palette])
  const theme = useTheme()
  const matches = useMediaQuery(
    theme.breakpoints.down(content.mobile_breakpoint || 'xs')
  )
  const icon = content.icon?.name ? (
    <LmIcon iconName={content.icon.name} />
  ) : (
    <Magnify />
  )
  const label = content.label || content.placeholder || 'Search'
  const common = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      event.currentTarget.focus()
      palette.open(content)
    },
    'data-lm-search-version': 'command-palette-v1',
    'data-lm-search-label': content.label || '',
    'data-lm-search-placeholder': content.placeholder || '',
    'data-lm-search-mode':
      content.mobile_breakpoint && matches ? 'icon' : 'input',
    'aria-label': label,
    'aria-haspopup': 'dialog' as const
  }
  if (content.mobile_breakpoint && matches) {
    return (
      <IconButton {...common} color="inherit" size="large">
        {icon}
      </IconButton>
    )
  }
  return (
    <ButtonBase {...common} sx={getOpenerStyles(content)}>
      {icon}
      <SearchOpenerLabel content={content} />
    </ButtonBase>
  )
}

import { RefObject, useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useAutocomplete from '@mui/material/useAutocomplete'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Close from 'mdi-material-ui/Close'
import useSWR from 'swr'
import { CONFIG } from '../../utils/config'
import { useAppContext } from '../provider/context/AppContext'
import type { ListSearchAutocompleteStoryblok } from '../../typings/generated/components-schema'
import { getLinkAttrs } from '../../utils/linkHandler'
import MuiNextLink from '../link/MuiNextLink'
import { match, parse } from './autosuggest'
import {
  fetchSearchStories,
  searchStoryTitle,
  SearchStory
} from './searchPaletteData'

export default function SearchPaletteDialog({
  content,
  onClose
}: {
  content: ListSearchAutocompleteStoryblok
  onClose: () => void
}) {
  const searchInput = useRef<HTMLInputElement>(null)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      slotProps={{
        transition: { onEntered: () => searchInput.current?.focus() },
        paper: {
          square: content.menu_square,
          variant: content.menu_outlined ? 'outlined' : 'elevation',
          elevation:
            content.menu_elevation !== undefined
              ? Number(content.menu_elevation)
              : 1,
          sx: { borderRadius: content.menu_border_radius || undefined }
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {content.label || 'Search'}
        <IconButton aria-label="Close search" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <SearchResults
        content={content}
        onClose={onClose}
        fullScreen={fullScreen}
        searchInput={searchInput}
      />
    </Dialog>
  )
}

function SearchStatus({
  queryLength,
  busy,
  error,
  count,
  notFoundLabel,
  onRetry
}: {
  queryLength: number
  busy: boolean
  error: unknown
  count: number
  notFoundLabel: string | undefined
  onRetry: () => void
}) {
  return (
    <Box role="status" aria-live="polite" sx={{ py: 2 }}>
      {queryLength < 2 ? (
        'Type at least 2 characters to search.'
      ) : busy ? (
        'Searching…'
      ) : error ? (
        <>
          Search could not be loaded. <Button onClick={onRetry}>Retry</Button>
        </>
      ) : count === 0 ? (
        notFoundLabel || 'No results found.'
      ) : (
        `${count} results`
      )}
    </Box>
  )
}

function SearchResults({
  content,
  onClose,
  fullScreen,
  searchInput
}: {
  content: ListSearchAutocompleteStoryblok
  onClose: () => void
  fullScreen: boolean
  searchInput: RefObject<HTMLInputElement | null>
}) {
  const [input, setInput] = useState('')
  const [debounced, setDebounced] = useState('')
  const { locale, defaultLocale, locales } = useAppContext()
  const query = input.trim()
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 400)
    return () => clearTimeout(timer)
  }, [query])
  let prefix = defaultLocale !== locale ? locale : undefined
  if (CONFIG.rootDirectory) prefix = CONFIG.rootDirectory
  if (CONFIG.enableLocaleSuffix) prefix = locale
  const ready = query.length >= 2 && query === debounced
  const { data, error, isLoading, mutate } = useSWR(
    ready
      ? ([
          'search-palette-pages',
          query,
          prefix,
          locales?.filter((item) => item !== defaultLocale).join(',') || ''
        ] as const)
      : null,
    fetchSearchStories
  )
  const options = ready ? data || [] : []
  const { getRootProps, getInputProps, getListboxProps, getOptionProps } =
    useAutocomplete<SearchStory>({
      options,
      inputValue: input,
      open: true,
      autoHighlight: true,
      getOptionLabel: searchStoryTitle,
      getOptionKey: (story) => story.uuid,
      filterOptions: (items) => items,
      onInputChange: (_event, value, reason) => {
        if (reason === 'input' || reason === 'clear') setInput(value)
      },
      onChange: (event, story) => {
        if (story) {
          // Follow the same anchor as pointer activation, including locale handling.
          if (event.type === 'keydown') {
            document.getElementById(`search-result-${story.uuid}`)?.click()
          }
          onClose()
        }
      }
    })
  const inputProps = getInputProps()
  const busy = query.length >= 2 && (!ready || isLoading)
  return (
    <DialogContent>
      <Box
        {...getRootProps()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            onClose()
            return
          }
          getRootProps().onKeyDown?.(event)
        }}
      >
        <TextField
          fullWidth
          autoFocus
          inputRef={searchInput}
          placeholder={content.placeholder || 'Search pages and landing pages'}
          slotProps={{
            htmlInput: {
              ...inputProps,
              'aria-label': content.label || 'Search'
            }
          }}
        />
        <SearchStatus
          queryLength={query.length}
          busy={busy}
          error={error}
          count={options.length}
          notFoundLabel={content.not_found_label}
          onRetry={() => void mutate()}
        />
        <Box
          component="ul"
          {...getListboxProps()}
          sx={{
            m: 0,
            p: 0,
            listStyle: 'none',
            maxHeight: fullScreen ? 'none' : '50vh',
            overflowY: 'auto'
          }}
        >
          {options.map((story, index) => {
            const { key, ...props } = getOptionProps({ option: story, index })
            const { href } = getLinkAttrs(
              { cached_url: story.full_slug, linktype: 'story' },
              {}
            )
            return (
              <Box
                component="li"
                {...props}
                key={key}
                sx={{
                  borderRadius: 1,
                  '&.Mui-focused': { bgcolor: 'action.selected' },
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <MuiNextLink
                  id={`search-result-${story.uuid}`}
                  href={href}
                  prefetch={false}
                  tabIndex={-1}
                  sx={{
                    display: 'block',
                    p: 1.5,
                    color: 'inherit',
                    textDecoration: 'none'
                  }}
                >
                  <Box component="span" sx={{ display: 'block' }}>
                    {parse(
                      searchStoryTitle(story),
                      match(searchStoryTitle(story), query)
                    ).map((part, partIndex) => (
                      <Box
                        component="span"
                        // Highlight fragments are positional within this title.
                        // eslint-disable-next-line react/no-array-index-key
                        key={partIndex}
                        sx={{ fontWeight: part.highlight ? 700 : undefined }}
                      >
                        {part.text}
                      </Box>
                    ))}
                  </Box>
                </MuiNextLink>
              </Box>
            )
          })}
        </Box>
      </Box>
    </DialogContent>
  )
}

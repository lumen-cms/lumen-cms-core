import React, { createRef, RefObject, useState } from 'react'
import { alpha } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import Magnify from 'mdi-material-ui/Magnify'
import Paper from '@mui/material/Paper'
import { StoryData } from 'storyblok-js-client'
import { useDebouncedCallback } from 'use-debounce'
import InputAdornment from '@mui/material/InputAdornment'
import useSWR from 'swr'
import { CONFIG } from '@CONFIG'
import { PageComponent } from '../../typings/generated/schema'
import LmIcon from '../icon/LmIcon'
import MuiNextLink from '../link/MuiNextLink'
import { getLinkAttrs } from '../../utils/linkHandler'

import { LmListSearchAutocompleteProps } from './listWidgetTypes'

import { ListSearchAutocompleteContainer } from './ListSearchAutocompleteContainer'
import { match, parse } from './autosuggest'
import { useAppContext } from '@context/AppContext'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles({ name: 'ListSearchAutocomplete' })((theme) => ({
  root: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'inherit'
    }
  },
  inputRoot: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha('rgba(0,0,0,.05)', 0.15),
    color: 'inherit',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.action.focus
    },
    '&:hover': {
      backgroundColor: alpha('rgba(0,0,0,.05)', 0.25),
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.action.focus
      }
    }
  },
  borderSquare: {
    borderRadius: 0,
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: 0
    }
  },
  borderRounded: {
    borderRadius: '25px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '25px'
    }
  },
  inputDefaultWidth: {
    color: 'inherit',
    transition: theme.transitions.create('width')
  },
  variableWidth: {
    '&.MuiAutocomplete-input': {
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus,&:active': {
          width: 200
        }
      }
    }
  },
  listbox: {
    '& .MuiLink-root': {
      display: 'block',
      width: '100%',
      color: 'inherit',
      '&:hover': {
        textDecoration: 'none'
      }
    }
  }
}))
let cacheVersion: number | undefined

const fetcher = async (
  path: string,
  searchterm: string,
  locale?: string,
  locales?: string
): Promise<StoryData<PageComponent>[]> => {
  if (!searchterm) {
    return []
  }

  const v2Url = new URL(`https://api.storyblok.com/v2${path}`)
  if (cacheVersion) {
    v2Url.searchParams.append('cv', `${cacheVersion}`)
  }
  v2Url.searchParams.append('token', CONFIG.publicToken)
  v2Url.searchParams.append('filter_query[component][in]', 'page')
  v2Url.searchParams.append('per_page', '25')
  v2Url.searchParams.append('sort_by', 'content.preview_title:desc')
  v2Url.searchParams.append(
    'excluding_fields',
    'body,right_body,meta_robots,property,seo_body'
  )
  v2Url.searchParams.append('search_term', searchterm)
  let excluding_slugs = 'demo-content*'
  if (locale) {
    v2Url.searchParams.append('starts_with', `${locale}/`)
  } else if (locales) {
    excluding_slugs = `${excluding_slugs},${locales
      .split(',')
      .map((lang) => `${lang}/*`)
      .join(',')}`
  }
  v2Url.searchParams.append('excluding_slugs', excluding_slugs)
  const result = await fetch(v2Url.toString()).then((r) => r.json())
  if (!cacheVersion) {
    cacheVersion = result.cv
  }
  return result.stories || []
}

type ListOptions = {
  uuid: string
  full_slug: string
  label: string
}[]
export default function LmListSearchAutocomplete({
  content
}: LmListSearchAutocompleteProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>()
  const { classes, cx, theme } = useStyles()
  const { defaultLocale, locale, locales } = useAppContext()
  const inputRef: RefObject<HTMLInputElement> = createRef()
  const [open, setOpen] = useState<boolean | undefined>()
  const matches = useMediaQuery(
    theme.breakpoints.down(content.mobile_breakpoint || 'xs')
  )
  let prefixLocale = defaultLocale !== locale ? locale : undefined
  if (CONFIG.rootDirectory) {
    prefixLocale = CONFIG.rootDirectory
  }
  if (CONFIG.enableLocaleSuffix) {
    prefixLocale = locale
  }
  const isMobileAction = content.mobile_breakpoint && matches
  const callback = useDebouncedCallback((value: string) => {
    if (value.length < 2) {
      return
    }
    setSearchTerm(value)
    setOpen(true)
  }, 400)
  const additionalLocales = locales
    ?.filter((i) => i !== defaultLocale)
    .join(',')
  const { data } = useSWR(
    searchTerm
      ? [`/cdn/stories`, searchTerm, prefixLocale, additionalLocales]
      : null,
    fetcher
  )
  const allStories = data || []

  const options: ListOptions = allStories
    .map((option) => ({
      uuid: option.uuid,
      full_slug: option.full_slug,
      label:
        option.content?.preview_title ||
        option.content?.meta_title ||
        option.name ||
        ''
    }))
    .sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))
  return (
    <ListSearchAutocompleteContainer
      content={content}
      popperActive={open}
      inputRef={inputRef}
      isMobileAction={!!isMobileAction}
    >
      <Autocomplete
        autoComplete
        fullWidth={content.fullwidth}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        style={{ width: isMobileAction ? '100%' : undefined }}
        options={options}
        freeSolo
        classes={{
          root: classes.root,
          listbox: classes.listbox,
          inputRoot: cx(classes.inputRoot, {
            [classes.borderSquare]: content.shape === 'square',
            [classes.borderRounded]: content.shape === 'rounded'
          }),
          input: cx(classes.inputDefaultWidth, {
            [classes.variableWidth]: !isMobileAction
          })
        }}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              size={content.large ? 'medium' : 'small'}
              variant="outlined"
              label={content.label || undefined}
              placeholder={content.placeholder}
              fullWidth={!!(content.fullwidth || isMobileAction)}
              inputRef={inputRef}
              InputProps={{
                ...params.InputProps,
                style: {
                  height: content.height ? Number(content.height) : undefined
                },
                onFocus: () => {
                  setOpen(true)
                },
                onBlur: () => {
                  setOpen(false)
                },
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  callback(event.currentTarget.value),
                autoComplete: 'new-password',
                startAdornment: (
                  <InputAdornment position="start">
                    {' '}
                    {content.icon?.name ? (
                      <LmIcon iconName={content.icon.name} />
                    ) : (
                      <Magnify />
                    )}
                  </InputAdornment>
                )
              }}
            />
          )
        }}
        noOptionsText={content.not_found_label}
        getOptionLabel={(option) => option.label}
        PaperComponent={(props) => (
          <Paper
            {...props}
            square={content.menu_square}
            variant={content.menu_outlined ? 'outlined' : 'elevation'}
            elevation={
              content.menu_elevation ? Number(content.menu_elevation) : 1
            }
            style={{
              ...props.style,
              borderRadius: content.menu_border_radius
                ? content.menu_border_radius
                : undefined
            }}
          />
        )}
        renderOption={(_props, item, { inputValue }) => {
          const { href } = getLinkAttrs(
            {
              cached_url: item.full_slug,
              linktype: 'story'
            },
            {}
          )
          const matchValue = match(item.label, inputValue)
          const parts = parse(item.label, matchValue)

          return (
            <MuiNextLink
              href={href}
              passHref
              key={item.uuid as string}
              prefetch={false}
            >
              {parts.map((part, index) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${index}`}
                  style={{
                    fontWeight: part.highlight ? 700 : undefined,
                    backgroundColor: part.highlight ? '#fff59d' : undefined
                  }}
                >
                  {part.text}
                </span>
              ))}
            </MuiNextLink>
          )
        }}
      />
    </ListSearchAutocompleteContainer>
  )
}
